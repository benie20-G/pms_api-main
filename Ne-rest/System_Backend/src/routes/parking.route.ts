import { Router } from "express";
import parkingController from "../controller/parking.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateParkingDTO, UpdateParkingDTO } from "../dtos/parking.dto";

const parkingRouter = Router();

/**
 * @route   POST /api/parking/create
 * @desc    Create a new parking location (Admin only)
 * @access  Private (Admin)
 */
parkingRouter.post(
    "/create",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(CreateParkingDTO),
    parkingController.createParking as any
);

/**
 * @route   GET /api/parking/all
 * @desc    Get all parking locations
 * @access  Private (Admin or Parking Attendant)
 */
parkingRouter.get(
    "/all",
    checkLoggedIn,
    parkingController.getAllParkings
);

/**
 * @route   GET /api/parking/:id
 * @desc    Get a specific parking by ID
 * @access  Private
 */
parkingRouter.get(
    "/:id",
    checkLoggedIn,
    parkingController.getParkingById
);

/**
 * @route   PUT /api/parking/:id
 * @desc    Update a parking by ID
 * @access  Private (Admin only)
 */
parkingRouter.put(
    "/:id",
    checkLoggedIn,
    checkAdmin,
    validationMiddleware(UpdateParkingDTO, true),
    parkingController.updateParking
);

/**
 * @route   DELETE /api/parking/:id
 * @desc    Delete a parking location by ID
 * @access  Private (Admin only)
 */
parkingRouter.delete(
    "/:id",
    checkLoggedIn,
    checkAdmin,
    parkingController.deleteParking
);

export default parkingRouter;
