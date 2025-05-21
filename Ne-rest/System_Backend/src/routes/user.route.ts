import { ErrorRequestHandler, RequestHandler, Router } from "express";
import userController from "../controller/user.controller"
import {
  ChangePasswordDTO,
  CreateUserDTO,
  UpdateAvatarDTO,
  UpdateUserDTO,
} from "../dtos/user.dto"; // Importing DTOs for user validation
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const userRouter = Router();

// Route to create a new user (with validation)
userRouter.post(
  "/create",
  [validationMiddleware(CreateUserDTO)],
  userController.createUser
);

// Route to update user details (must be logged in, with validation)
userRouter.put(
  "/update",
  [checkLoggedIn, validationMiddleware(UpdateUserDTO)],
  userController.updateUser
);

// Route to get the currently logged-in user's details
userRouter.get("/me", [checkLoggedIn], userController.me);

// Route to get all users (must be logged in)
userRouter.get("/all", checkLoggedIn, userController.all);

// Route to get a user by their ID (public)
userRouter.get("/:id", [], userController.getById);

// Route to search users by name (public)
userRouter.get("/search/:query", [], userController.searchUser);

// Route to delete the currently logged-in user
userRouter.delete("/me", [checkLoggedIn], userController.deleteUser);

// Route to remove the avatar/profile picture of the logged-in user
userRouter.delete(
  "/remove-avatar",
  [checkLoggedIn],
  userController.removeAvatar
);

// Route to delete a user by their ID (admin only)
userRouter.delete("/by-id/:id", [checkAdmin], userController.deleteById);

// Route to update the avatar/profile picture (must be logged in, with validation)
userRouter.put(
  "/update-avatar",
  [checkLoggedIn, validationMiddleware(UpdateAvatarDTO)],
  userController.updateAvatar
);

// Route to update the password (must be logged in, with validation)
userRouter.put(
  "/update-password",
  [checkLoggedIn, validationMiddleware(ChangePasswordDTO)],
  userController.updatePassword
);

export default userRouter;
