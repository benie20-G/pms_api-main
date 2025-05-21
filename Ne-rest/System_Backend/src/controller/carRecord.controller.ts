import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import prisma from "../../prisma/prisma-client";
import { ExitCarRecordDto } from "../dtos/carRecord.dto";

const prismaClient = new PrismaClient();

// Create car record
export const createCarRecord = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    const { plateNumber, parkingId, userId } = req.body;
    const loggedInUserId = authReq.user.id ?? userId;

    const parking = await prismaClient.parking.findUnique({
      where: { id: parkingId },
    });

    if (!parking) {
      return ServerResponse.error(res, "Parking not found");
    }

    if (parking.availableSpaces <= 0) {
      return ServerResponse.error(res, "No available spaces in this parking");
    }

    const result = await prismaClient.$transaction(async (tx) => {
      const carRecord = await tx.carRecord.create({
        data: {
          plateNumber,
          parkingId,
          userId: loggedInUserId,
          entryTime: new Date(),
          chargedAmount: 0,
        },
        include: {
          parking: true,
          user: true,
        },
      });

      const ticket = await tx.ticket.create({
        data: {
          carRecordId: carRecord.id,
          issuedAt: new Date(),
        },
      });

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
    console.error("Error creating car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Update car record
export const updateCarRecord = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    const { id } = req.params;
    const { exitTime, chargedAmount } = req.body;

    const carRecord = await prismaClient.carRecord.findUnique({
      where: { id },
      include: {
        parking: true,
      },
    });

    if (!carRecord) {
      return ServerResponse.error(res, "Car record not found");
    }

    if (carRecord.exitTime) {
      return ServerResponse.error(res, "Car has already exited");
    }

    const exitDateTime = exitTime ? new Date(exitTime) : new Date();
    const entryDateTime = carRecord.entryTime;
    const durationHours = (exitDateTime.getTime() - entryDateTime.getTime()) / (1000 * 60 * 60);
    const calculatedCharge = durationHours * carRecord.parking.feePerHour;

    const result = await prismaClient.$transaction(async (tx) => {
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
    console.error("Error updating car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Get all car records
export const getAllCarRecords = async (req: Request, res: Response) => {
  try {
    const carRecords = await prismaClient.carRecord.findMany({
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
export const getCarRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const carRecord = await prismaClient.carRecord.findUnique({
      where: { id },
      include: {
        parking: true,
        user: true,
        ticket: true,
      },
    });

    if (!carRecord) {
      return ServerResponse.error(res, "Car record not found");
    }

    return ServerResponse.success(res, "Car record retrieved successfully", carRecord);
  } catch (error) {
    console.error("Error fetching car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Delete car record
export const deleteCarRecord = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    const { id } = req.params;

    const carRecord = await prismaClient.carRecord.findUnique({
      where: { id },
      include: {
        parking: true,
      },
    });

    if (!carRecord) {
      return ServerResponse.error(res, "Car record not found");
    }

    const result = await prismaClient.$transaction(async (tx) => {
      // If car hasn't exited, increase available spaces before deleting
      if (!carRecord.exitTime) {
        await tx.parking.update({
          where: { id: carRecord.parkingId },
          data: {
            availableSpaces: carRecord.parking.availableSpaces + 1,
          },
        });
      }

      // Delete associated ticket first if exists
      await tx.ticket.deleteMany({
        where: { carRecordId: carRecord.id },
      });

      // Delete the car record
      return tx.carRecord.delete({
        where: { id },
      });
    });

    return ServerResponse.success(res, "Car record deleted successfully", result);
  } catch (error) {
    console.error("Error deleting car record:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

export const exitCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Find the car record
    const carRecord = await prismaClient.carRecord.findUnique({
      where: { id },
      include: { parking: true }
    });

    if (!carRecord) {
      return res.status(404).json({ message: "Car record not found" });
    }

    if (carRecord.exitTime) {
      return res.status(400).json({ message: "Car already exited" });
    }

    // Calculate duration and charge
    const exitTime = new Date();
    const entryTime = new Date(carRecord.entryTime);
    const durationHours = Math.max(
      (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60),
      0
    );
    const chargedAmount = Math.ceil(durationHours) * carRecord.parking.feePerHour;

    // Update car record
    const updatedCarRecord = await prismaClient.carRecord.update({
      where: { id },
      data: {
        exitTime,
        chargedAmount,
      },
    });

    // Increment available spaces in parking
    await prismaClient.parking.update({
      where: { id: carRecord.parkingId },
      data: {
        availableSpaces: { increment: 1 },
      },
    });

    return res.json({
      success: true,
      message: "Car exit recorded successfully",
      data: updatedCarRecord,
    });
  } catch (error) {
    console.error("Car exit error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const carRecordController = {
  createCarRecord,
  updateCarRecord,
  getAllCarRecords,
  getCarRecordById,
  deleteCarRecord,
  exitCar
};

export default carRecordController;
