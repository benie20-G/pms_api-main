//make a controller for the ticket

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";

const prisma = new PrismaClient();  

   //create a ticket

// Create ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    const { carRecordId } = req.body;

    const carRecord = await prisma.carRecord.findUnique({
      where: { id: carRecordId },
    });

    if (!carRecord) {
      return ServerResponse.error(res, "Car record not found");
    }

    const ticket = await prisma.ticket.create({
      data: {
        carRecordId,
        issuedAt: new Date(),
      },
      include: {
        carRecord: {
          include: {
            parking: true,
            user: true,
          },
        },
      },
    });

    return ServerResponse.success(res, "Ticket created successfully", ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Get ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        carRecord: {
          include: {
            parking: true,
            user: true,
          },
        },
      },
    });

    if (!ticket) {
      return ServerResponse.error(res, "Ticket not found");
    }

    return ServerResponse.success(res, "Ticket retrieved successfully", ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Get all tickets
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        carRecord: {
          include: {
            parking: true,
            user: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    return ServerResponse.success(res, "Tickets retrieved successfully", tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

// Delete ticket
export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return ServerResponse.error(res, "Ticket not found");
    }

    await prisma.ticket.delete({
      where: { id },
    });

    return ServerResponse.success(res, "Ticket deleted successfully");
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

const ticketController = {
  createTicket,
  getTicketById,
  getAllTickets,
  deleteTicket,
};

export default ticketController;

