import { Router } from "express";
import carRecordController from "../controller/carRecord.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateCarRecordDto, UpdateCarRecordDto, ExitCarRecordDto }  from "../dtos/carRecord.dto"

const carRecordRouter = Router();

carRecordRouter.post("/create",checkLoggedIn,validationMiddleware(CreateCarRecordDto), carRecordController.createCarRecord);
carRecordRouter.get("/all", checkLoggedIn, carRecordController.getAllCarRecords);
carRecordRouter.get("/:id", checkLoggedIn, carRecordController.getCarRecordById);
carRecordRouter.put("/:id", checkLoggedIn, validationMiddleware(UpdateCarRecordDto, true), carRecordController.updateCarRecord);
carRecordRouter.put("/:id/exit", validationMiddleware(ExitCarRecordDto, true), carRecordController.exitCar);

carRecordRouter.delete("/:id", checkLoggedIn, carRecordController.deleteCarRecord);

export default carRecordRouter;
