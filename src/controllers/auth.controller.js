const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { generateOTP } = require('../utils/helpers');
const ServerResponse = require('../utils/ServerResponse');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return ServerResponse.error(res, 'User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = generateOTP();

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                verificationToken
            }
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return ServerResponse.created(res, 'User registered successfully. Please check your email for verification.');
    } catch (error) {
        console.error('Error in register:', error);
        return ServerResponse.serverError(res);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return ServerResponse.notFound(res, 'User not found');
        }

        if (user.verificationToken !== token) {
            return ServerResponse.error(res, 'Invalid verification token');
        }

        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationToken: null
            }
        });

        return ServerResponse.success(res, 'Email verified successfully');
    } catch (error) {
        console.error('Error in verifyEmail:', error);
        return ServerResponse.serverError(res);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return ServerResponse.notFound(res, 'User not found');
        }

        if (!user.isVerified) {
            return ServerResponse.error(res, 'Please verify your email first');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return ServerResponse.error(res, 'Invalid password');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return ServerResponse.success(res, 'Login successful', {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        return ServerResponse.serverError(res);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return ServerResponse.notFound(res, 'User not found');
        }

        const resetToken = generateOTP();
        await prisma.user.update({
            where: { email },
            data: { resetToken }
        });

        await sendPasswordResetEmail(email, resetToken);

        return ServerResponse.success(res, 'Password reset instructions sent to your email');
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return ServerResponse.serverError(res);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return ServerResponse.notFound(res, 'User not found');
        }

        if (user.resetToken !== token) {
            return ServerResponse.error(res, 'Invalid reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetToken: null
            }
        });

        return ServerResponse.success(res, 'Password reset successfully');
    } catch (error) {
        console.error('Error in resetPassword:', error);
        return ServerResponse.serverError(res);
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword
}; 