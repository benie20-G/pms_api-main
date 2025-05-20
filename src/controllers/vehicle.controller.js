const { PrismaClient } = require('@prisma/client');
const ServerResponse = require('../utils/ServerResponse');
const { validatePlateNumber } = require('../utils/helpers');

const prisma = new PrismaClient();

const registerVehicle = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { plateNumber, vehicleType } = req.body;

        if (!validatePlateNumber(plateNumber)) {
            return ServerResponse.error(res, 'Invalid plate number format');
        }

        const existingVehicle = await prisma.vehicle.findFirst({
            where: { plateNumber }
        });

        if (existingVehicle) {
            return ServerResponse.error(res, 'Vehicle with this plate number already exists');
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                plateNumber,
                vehicleType,
                userId
            }
        });

        return ServerResponse.created(res, 'Vehicle registered successfully', vehicle);
    } catch (error) {
        console.error('Error in registerVehicle:', error);
        return ServerResponse.serverError(res);
    }
};

const getVehicles = async (req, res) => {
    try {
        const userId = req.user.userId;

        const vehicles = await prisma.vehicle.findMany({
            where: { userId }
        });

        return ServerResponse.success(res, 'Vehicles retrieved successfully', vehicles);
    } catch (error) {
        console.error('Error in getVehicles:', error);
        return ServerResponse.serverError(res);
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { vehicleType } = req.body;
        const userId = req.user.userId;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            return ServerResponse.notFound(res, 'Vehicle not found');
        }

        if (vehicle.userId !== userId) {
            return ServerResponse.error(res, 'Unauthorized access to vehicle');
        }

        const updatedVehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: { vehicleType }
        });

        return ServerResponse.success(res, 'Vehicle updated successfully', updatedVehicle);
    } catch (error) {
        console.error('Error in updateVehicle:', error);
        return ServerResponse.serverError(res);
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const userId = req.user.userId;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            return ServerResponse.notFound(res, 'Vehicle not found');
        }

        if (vehicle.userId !== userId) {
            return ServerResponse.error(res, 'Unauthorized access to vehicle');
        }

        await prisma.vehicle.delete({
            where: { id: vehicleId }
        });

        return ServerResponse.success(res, 'Vehicle deleted successfully');
    } catch (error) {
        console.error('Error in deleteVehicle:', error);
        return ServerResponse.serverError(res);
    }
};

module.exports = {
    registerVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
}; 