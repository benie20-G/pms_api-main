import { compareSync, hashSync } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { User } from "@prisma/client";
import { sendAccountVerificationEmail } from "../utils/mail";
import crypto from "crypto";

config();

// Controller for user-related operations

// Create a new user account
const createUser = async (req: Request, res: Response) => {
  try {
    // Extract user details from request body
    const { email, names, telephone, password, role } = req.body;
    console.log("body", req.body);

    // Hash the user's password before saving
    const hashedPassword = hashSync(password, 10);
    console.log("hashedPassword", hashedPassword);

    // Create user in the database
      const verificationCode = crypto.randomInt(100000, 999999).toString();
    const user = await prisma.user.create({
      data: {
        email,
        names,
        role,
        password: hashedPassword,
        verificationCode: verificationCode,
        telephone,
      },
    });

    // Generate JWT token for the new user
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" }
    );

  
    await sendAccountVerificationEmail(email, names, verificationCode);
    
    // Send success response with user and token
    return ServerResponse.created(res, "User created successfully", {
      user,
      token,
    });
   

  } catch (error: any) {
    console.log("error", error);
    // Handle unique constraint errors (e.g., email or telephone already exists)
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Update user details for the logged-in user
const updateUser: any = async (req: AuthRequest, res: Response) => {
  try {
    const { email, names, telephone } = req.body;
    // Update user in the database
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        email,
        names,
        telephone,
      },
    });
    return ServerResponse.success(res, "User updated successfully", { user });
  } catch (error: any) {
    // Handle unique constraint errors
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Get the currently logged-in user's details
const me: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    return ServerResponse.success(res, "User fetched successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Get all users in the system
const all = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    return ServerResponse.success(res, "User updated successfully", { users });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Get a user by their ID
const getById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    return ServerResponse.success(res, "User fetched successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Search users by name (case-insensitive)
const searchUser = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const users = await prisma.user.findMany({
      where: { names: { contains: query, mode: "insensitive" } },
    });
    return ServerResponse.success(res, "Users fetched successfully", { users });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Delete the currently logged-in user
const deleteUser: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.user.id } });
    return ServerResponse.success(res, "User deleted successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Remove the avatar/profile picture for the logged-in user
const removeAvatar: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        profilePicture:
          "https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#fromView=keyword&page=1&position=0&uuid=23ba6a93-2bc2-45e5-af6b-cee8a51af976&query=Profile",
      },
    });
    return ServerResponse.success(res, "User updated successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Delete a user by their ID (admin functionality)
const deleteById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.params.id } });
    return ServerResponse.success(res, "User deleted successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Update the avatar/profile picture for the logged-in user
const updateAvatar: any = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        profilePicture: req.body.url,
      },
    });
    return ServerResponse.success(res, "User updated successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Update the password for the logged-in user
const updatePassword: any = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) ServerResponse.error(res, "User not found", 404);

    // Check if the old password is correct
    const isPasswordValid = compareSync(oldPassword, (user as User).password);
    if (!isPasswordValid)
      return ServerResponse.error(res, "Invalid old password", 400);

    // Hash and update the new password
    const hashedPassword = hashSync(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
      },
    });
    return ServerResponse.success(res, "Password updated successfully", {
      user: updatedUser,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

// Export all user controller functions as an object
const userController = {
  createUser,
  updateUser,
  me,
  all,
  getById,
  searchUser,
  deleteUser,
  removeAvatar,
  deleteById,
  updateAvatar,
  updatePassword,
};

export default userController;
