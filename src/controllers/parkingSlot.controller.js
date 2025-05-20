const { PrismaClient } = require('@prisma/client');
const ServerResponse = require('../utils/ServerResponse');

const prisma = new PrismaClient();

const getAllSlots = async (req, res) => {
    try {
        const slots = await prisma.parkingSlot.findMany({
            include: {
                parking: true
            }
        });

        return ServerResponse.success(res, 'All parking slots retrieved successfully', slots);
    } catch (error) {
        console.error('Error in getAllSlots:', error);
        return ServerResponse.serverError(res);
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { parkingCode } = req.params;

        const parking = await prisma.parking.findUnique({
            where: { code: parkingCode },
            include: {
                slots: {
                    where: { status: 'AVAILABLE' }
                }
            }
        });

        if (!parking) {
            return ServerResponse.notFound(res, 'Parking location not found');
        }

        return ServerResponse.success(res, 'Available slots retrieved successfully', {
            parkingName: parking.name,
            totalSlots: parking.totalSlots,
            availableSlots: parking.slots.length,
            slots: parking.slots
        });
    } catch (error) {
        console.error('Error in getAvailableSlots:', error);
        return ServerResponse.serverError(res);
    }
};

const createSlot = async (req, res) => {
    try {
        const { slotNumber, parkingId } = req.body;

        // Check if slot number already exists
        const existingSlot = await prisma.parkingSlot.findFirst({
            where: { slotNumber }
        });

        if (existingSlot) {
            return ServerResponse.error(res, 'Slot number already exists');
        }

        const slot = await prisma.parkingSlot.create({
            data: {
                slotNumber,
                status: 'AVAILABLE',
                parkingId
            }
        });

        return ServerResponse.created(res, 'Parking slot created successfully', slot);
    } catch (error) {
        console.error('Error in createSlot:', error);
        return ServerResponse.serverError(res);
    }
};

const updateSlotStatus = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { status } = req.body;

        const slot = await prisma.parkingSlot.findUnique({ where: { id: slotId } });
        if (!slot) {
            return ServerResponse.notFound(res, 'Parking slot not found');
        }

        const updatedSlot = await prisma.parkingSlot.update({
            where: { id: slotId },
            data: { status }
        });

        return ServerResponse.success(res, 'Slot status updated successfully', updatedSlot);
    } catch (error) {
        console.error('Error in updateSlotStatus:', error);
        return ServerResponse.serverError(res);
    }
};

const getSlotHistory = async (req, res) => {
    try {
        const { slotId } = req.params;

        const slot = await prisma.parkingSlot.findUnique({
            where: { id: slotId },
            include: {
                requests: {
                    orderBy: { requestedAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!slot) {
            return ServerResponse.notFound(res, 'Parking slot not found');
        }

        return ServerResponse.success(res, 'Slot history retrieved successfully', {
            slotId: slot.id,
            status: slot.status,
            history: slot.requests
        });
    } catch (error) {
        console.error('Error in getSlotHistory:', error);
        return ServerResponse.serverError(res);
    }
};

module.exports = {
    getAllSlots,
    getAvailableSlots,
    createSlot,
    updateSlotStatus,
    getSlotHistory
}; 