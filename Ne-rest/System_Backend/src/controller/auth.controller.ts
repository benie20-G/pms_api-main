import { compare, compareSync, hash } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import {
  sendAccountVerificationEmail,
  sendPaswordResetEmail,
} from "../utils/mail";

// User login controller
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    // If user not found or password doesn't match, return error
    if (!user) return ServerResponse.error(res, "Invalid email or password");
    const isMatch = compareSync(password, user.password);
    if (!isMatch) return ServerResponse.error(res, "Invalid email or password");
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" }
    );
    // Return success response with user and token
    return ServerResponse.success(res, "Login successful", { user, token });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Initiate password reset process (send reset code to email)
const initiateResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    // Generate a 6-digit reset code and set expiry (6 hours)
    const passwordResetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6 hours
    // Update user with reset code and expiry
    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode,
        passwordResetExpires,
      },
    });
    // Send password reset email
    await sendPaswordResetEmail(email, user.names, passwordResetCode);
    return ServerResponse.success(
      res,
      "Password reset email sent successfully"
    );
  } catch (error) {
    console.log(error);
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Reset password using code
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, code } = req.body;
    // Find user with valid reset code and not expired
    const user = await prisma.user.findFirst({
      where: {
        passwordResetCode: code,
        passwordResetExpires: { gte: new Date() },
      },
    });
    if (!user) return ServerResponse.error(res, "Invalid or expired code");
    // Hash new password and update user
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null,
      },
    });
    return ServerResponse.success(res, "Password reset successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Initiate email verification (send verification code to email)
const initiateEmailVerification: any = async (req:Request, res:Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return ServerResponse.error(res, "User with this email not found");
    }

    // If already verified, return success
    if (existingUser.verificationStatus === "VERIFIED") {
      return ServerResponse.success(res, "Email is already verified");
    }

    // Generate verification code and expiry (6 hours)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6 hours

    // Update user with verification code and status
    const user = await prisma.user.update({
      where: { email },
      data: {
        verificationCode,
        verificationExpires,
        verificationStatus: "PENDING",
      },
    });

    // Send verification email
    await sendAccountVerificationEmail(
      user.email,
      user.names,
      verificationCode
    );

    return ServerResponse.success(res, "Verification email sent successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

// Verify email using code
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    // Find user with valid verification code and not expired
    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code,
        verificationExpires: { gte: new Date() },
      },
    });
    if (!user) return ServerResponse.error(res, "Invalid or expired code");
    // Update user as verified and clear code/expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationStatus: "VERIFIED",
        verificationCode: null,
        verificationExpires: null,
      },
    });
    return ServerResponse.success(res, "Verification successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Export all authentication controller functions
const authController = {
  login,
  initiateResetPassword,
  resetPassword,
  initiateEmailVerification,
  verifyEmail,
};

export default authController;
