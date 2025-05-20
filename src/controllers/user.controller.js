const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const ServerResponse = require('../utils/ServerResponse');

const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true,
                createdAt: true
            }
        });

        if (!user) {
            return ServerResponse.notFound(res, 'User not found');
        }

        return ServerResponse.success(res, 'Profile retrieved successfully', user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        return ServerResponse.serverError(res);
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true,
                updatedAt: true
            }
        });

        return ServerResponse.success(res, 'Profile updated successfully', updatedUser);
    } catch (error) {
        console.error('Error in updateProfile:', error);
        return ServerResponse.serverError(res);
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return ServerResponse.notFound(res, 'User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return ServerResponse.error(res, 'Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return ServerResponse.success(res, 'Password changed successfully');
    } catch (error) {
        console.error('Error in changePassword:', error);
        return ServerResponse.serverError(res);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true,
                createdAt: true
            }
        });

        return ServerResponse.success(res, 'Users retrieved successfully', users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        return ServerResponse.serverError(res);
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isVerified: true,
                updatedAt: true
            }
        });

        return ServerResponse.success(res, 'User role updated successfully', updatedUser);
    } catch (error) {
        console.error('Error in updateUserRole:', error);
        return ServerResponse.serverError(res);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await prisma.user.delete({ where: { id: userId } });

        return ServerResponse.success(res, 'User deleted successfully');
    } catch (error) {
        console.error('Error in deleteUser:', error);
        return ServerResponse.serverError(res);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUserRole,
    deleteUser
}; 