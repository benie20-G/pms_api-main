import { Request, RequestHandler } from "express";

export interface AuthRequest extends Request {

    user: {
        id: string;
    }
}


// export interface AuthMiddleware extends RequestHandler<> {
//     req: AuthRequest
// }

import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // you can safely access req.user now (possibly undefined)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};


//This file defines custom TypeScript types and interfaces (like AuthRequest and AuthMiddleware) 
// to extend and type-check Express request objects and middleware related to authentication.

// express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      }
    }
  }
}
