const { PrismaClient } = require('@prisma/client');
const { sendEntryTicket, sendExitBill, sendPaymentConfirmation } = require('../utils/email');
const ServerResponse = require('../utils/ServerResponse');

const prisma = new PrismaClient();

const createRequest = async (req, res) => {
    try {
        const { plateNumber, parkingCode } = req.body;
        const userId = req.user.userId;

        const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
        if (!parking) {
            return ServerResponse.notFound(res, 'Parking location not found');
        }

        const request = await prisma.parkingRequest.create({
            data: {
                userId,
                vehicleId: plateNumber,
                status: 'PENDING',
                requestedAt: new Date()
            }
        });

        return ServerResponse.created(res, 'Parking request created successfully', request);
    } catch (error) {
        console.error('Error in createRequest:', error);
        return ServerResponse.serverError(res);
    }
};

const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.parkingRequest.findUnique({
            where: { id },
            include: {
                user: true,
                parking: true
            }
        });

        if (!request) {
            return ServerResponse.notFound(res, 'Request not found');
        }

        if (request.status !== 'PENDING') {
            return ServerResponse.error(res, 'Request is not pending');
        }

        const updatedRequest = await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedAt: new Date(),
                checkIn: new Date()
            }
        });

        await sendEntryTicket(request.user.email, {
            entryId: request.id,
            plateNumber: request.vehicleId,
            parkingName: request.parking.name,
            entryDateTime: updatedRequest.checkIn,
            feePerHour: request.parking.feePerHour
        });

        return ServerResponse.success(res, 'Request approved successfully', updatedRequest);
    } catch (error) {
        console.error('Error in approveRequest:', error);
        return ServerResponse.serverError(res);
    }
};

const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.parkingRequest.findUnique({ where: { id } });
        if (!request) {
            return ServerResponse.notFound(res, 'Request not found');
        }

        if (request.status !== 'PENDING') {
            return ServerResponse.error(res, 'Request is not pending');
        }

        const updatedRequest = await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectedAt: new Date()
            }
        });

        return ServerResponse.success(res, 'Request rejected successfully', updatedRequest);
    } catch (error) {
        console.error('Error in rejectRequest:', error);
        return ServerResponse.serverError(res);
    }
};

const requestExit = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.parkingRequest.findUnique({ where: { id } });
        if (!request) {
            return ServerResponse.notFound(res, 'Request not found');
        }

        if (request.status !== 'APPROVED') {
            return ServerResponse.error(res, 'Request is not approved');
        }

        const updatedRequest = await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: 'EXIT_REQUESTED',
                exitRequestedAt: new Date()
            }
        });

        return ServerResponse.success(res, 'Exit requested successfully', updatedRequest);
    } catch (error) {
        console.error('Error in requestExit:', error);
        return ServerResponse.serverError(res);
    }
};

const approveExit = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.parkingRequest.findUnique({
            where: { id },
            include: {
                user: true,
                parking: true
            }
        });

        if (!request) {
            return ServerResponse.notFound(res, 'Request not found');
        }

        if (request.status !== 'EXIT_REQUESTED') {
            return ServerResponse.error(res, 'Exit is not requested');
        }

        const exitDateTime = new Date();
        const durationInHours = (exitDateTime - request.checkIn) / (1000 * 60 * 60);
        const chargedAmount = durationInHours * request.parking.feePerHour;

        const updatedRequest = await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: 'EXIT_APPROVED',
                exitApprovedAt: exitDateTime,
                checkOut: exitDateTime,
                amountToPay: chargedAmount
            }
        });

        await sendExitBill(request.user.email, {
            entryId: request.id,
            plateNumber: request.vehicleId,
            parkingName: request.parking.name,
            entryDateTime: request.checkIn,
            exitDateTime,
            durationInHours,
            chargedAmount
        });

        return ServerResponse.success(res, 'Exit approved successfully', updatedRequest);
    } catch (error) {
        console.error('Error in approveExit:', error);
        return ServerResponse.serverError(res);
    }
};

const processPayment = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.parkingRequest.findUnique({
            where: { id },
            include: {
                user: true,
                parking: true
            }
        });

        if (!request) {
            return ServerResponse.notFound(res, 'Request not found');
        }

        if (request.status !== 'EXIT_APPROVED') {
            return ServerResponse.error(res, 'Exit is not approved');
        }

        const updatedRequest = await prisma.parkingRequest.update({
            where: { id },
            data: {
                status: 'PAID',
                paidAt: new Date()
            }
        });

        await sendPaymentConfirmation(request.user.email, {
            entryId: request.id,
            plateNumber: request.vehicleId,
            parkingName: request.parking.name,
            amount: request.amountToPay,
            paidAt: updatedRequest.paidAt
        });

        return ServerResponse.success(res, 'Payment processed successfully', updatedRequest);
    } catch (error) {
        console.error('Error in processPayment:', error);
        return ServerResponse.serverError(res);
    }
};

module.exports = {
    createRequest,
    approveRequest,
    rejectRequest,
    requestExit,
    approveExit,
    processPayment
}; 