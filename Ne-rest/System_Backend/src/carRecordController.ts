import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";

const prisma = new PrismaClient();

// Validation schemas
const createCarRecordSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  parkingId: z.string().uuid("Invalid parking ID"),
});

const updateCarRecordSchema = z.object({
  exitTime: z.string().datetime().optional(),
  chargedAmount: z.number().min(0).optional(),
});

// Create car record (entry)
export const createCarRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { plateNumber, parkingId } = createCarRecordSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    // Check if parking exists and has available spaces
    const parking = await prisma.parking.findUnique({
      where: { id: parkingId },
    });

    if (!parking) {
      return ServerResponse.notFound(res, "Parking not found");
    }

    if (parking.availableSpaces <= 0) {
      return ServerResponse.badRequest(res, "No available spaces in this parking");
    }

    // Create car record and ticket in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create car record
      const carRecord = await tx.carRecord.create({
        data: {
          plateNumber,
          parkingId,
          userId,
          entryTime: new Date(),
          chargedAmount: 0,
        },
        include: {
          parking: true,
          user: true,
        },
      });

      // Generate ticket
      const ticket = await tx.ticket.create({
        data: {
          carRecordId: carRecord.id,
          issuedAt: new Date(),
        },
      });

      // Update available spaces
      await tx.parking.update({
        where: { id: parkingId },
        data: {
          availableSpaces: parking.availableSpaces - 1,
        },
      });

      return { carRecord, ticket };
    });

    return ServerResponse.success(res, "Car entry recorded successfully", result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ServerResponse.badRequest(res, error.errors);
    }
    console.error("Error creating car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Update car record (exit)
export const updateCarRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { exitTime, chargedAmount } = updateCarRecordSchema.parse(req.body);

    // Get car record with parking details
    const carRecord = await prisma.carRecord.findUnique({
      where: { id },
      include: {
        parking: true,
      },
    });

    if (!carRecord) {
      return ServerResponse.notFound(res, "Car record not found");
    }

    if (carRecord.exitTime) {
      return ServerResponse.badRequest(res, "Car has already exited");
    }

    // Calculate duration and charge if not provided
    const exitDateTime = exitTime ? new Date(exitTime) : new Date();
    const entryDateTime = carRecord.entryTime;
    const durationHours = (exitDateTime.getTime() - entryDateTime.getTime()) / (1000 * 60 * 60);
    const calculatedCharge = durationHours * carRecord.parking.feePerHour;

    // Update car record and parking spaces in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update car record
      const updatedRecord = await tx.carRecord.update({
        where: { id },
        data: {
          exitTime: exitDateTime,
          chargedAmount: chargedAmount ?? calculatedCharge,
        },
        include: {
          parking: true,
          user: true,
          ticket: true,
        },
      });

      // Update available spaces
      await tx.parking.update({
        where: { id: carRecord.parkingId },
        data: {
          availableSpaces: carRecord.parking.availableSpaces + 1,
        },
      });

      return updatedRecord;
    });

    return ServerResponse.success(res, "Car exit recorded successfully", result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ServerResponse.badRequest(res, error.errors);
    }
    console.error("Error updating car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Get all car records
export const getAllCarRecords = async (req: AuthRequest, res: Response) => {
  try {
    const carRecords = await prisma.carRecord.findMany({
      include: {
        parking: true,
        user: true,
        ticket: true,
      },
      orderBy: {
        entryTime: "desc",
      },
    });

    return ServerResponse.success(res, "Car records retrieved successfully", carRecords);
  } catch (error) {
    console.error("Error fetching car records:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Get car record by ID
export const getCarRecordById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const carRecord = await prisma.carRecord.findUnique({
      where: { id },
      include: {
        parking: true,
        user: true,
        ticket: true,
      },
    });

    if (!carRecord) {
      return ServerResponse.notFound(res, "Car record not found");
    }

    return ServerResponse.success(res, "Car record retrieved successfully", carRecord);
  } catch (error) {
    console.error("Error fetching car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
}; 