import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "../types";
import prisma from "../../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";

// Middleware to check if user is logged in (JWT authentication)
export const checkLoggedIn:any = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    // If no token is provided, user is not logged in
    if (!token) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }
    // Remove 'Bearer ' prefix if present
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    // If token is invalid, return error
    if (!decoded) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    // Attach user id to request object
    req.user = { id: (decoded as any).id };
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return ServerResponse.error(res, "Invalid or expired token");
  }
};

// Middleware to check if user is an admin
export const checkAdmin:any = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    console.log("Token:", token);
    console.log("Headers:", req.headers);

    // If no token is provided, user is not an admin
    if (!token) {
      return ServerResponse.unauthorized(res, "You are not an admin");
    }

    // Remove 'Bearer ' prefix if present
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    // Find user in the database by decoded id
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).id },
    });

    // If user not found, return error
    if (!user) {
      return ServerResponse.unauthorized(res, "User not found");
    }

    // If user is not an admin, deny access
    if (user.role !== "ADMIN") {
      return ServerResponse.unauthorized(
        res,
        "You're not allowed to access this resource"
      );
    }

    // Attach user id to request object and proceed
    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

