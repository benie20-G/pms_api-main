import { Request, Response } from "express";
import prisma from "../../prisma/prisma-client";
import { CreateParkingDTO, UpdateParkingDTO } from "../dtos/parking.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AuthRequest } from "../types";

// Create a new parking location (Admin only)
const createParking = async (req: AuthRequest, res: Response) => {
    const dto = plainToInstance(CreateParkingDTO, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const existing = await prisma.parking.findFirst({
            where: {
                code: dto.code,
            },
        });

        if (existing) {
            return res.status(400).json({ message: "Parking with this code already exists" });
        }

        const parking = await prisma.parking.create({
            data: {
                code: dto.code,
                name: dto.name,
                location: dto.location,
                totalSpaces: dto.totalSpaces,
                availableSpaces: dto.totalSpaces, // initially all spaces are available
                feePerHour: dto.feePerHour,
            },
        });

        return res.status(201).json(parking);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create parking", error });
    }
};

// Get all parking locations (accessible to Admin and Parking Attendant)
const getAllParkings = async (req: Request, res: Response) => {
    try {
        const parkings = await prisma.parking.findMany();
        return res.status(200).json(parkings);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch parking data", error });
    }
};

// Get a specific parking by ID
const getParkingById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const parking = await prisma.parking.findUnique({ where: { id } });

        if (!parking) {
            return res.status(404).json({ message: "Parking not found" });
        }

        return res.status(200).json(parking);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch parking", error });
    }
};

// Update a parking (Admin only)
const updateParking = async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = plainToInstance(UpdateParkingDTO, req.body);
    const errors = await validate(dto, { skipMissingProperties: true });
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const updated = await prisma.parking.update({
            where: { id },
            data: {
                code: dto.code,
                name: dto.name,
                location: dto.location,
                totalSpaces: dto.totalSpaces,
                feePerHour: dto.feePerHour,
            },
        });

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update parking", error });
    }
};

// Delete a parking (Admin only)
const deleteParking = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.parking.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete parking", error });
    }
};

const parkingController = {
    createParking,
    getAllParkings,
    getParkingById,
    updateParking,
    deleteParking,
};

export default parkingController;
