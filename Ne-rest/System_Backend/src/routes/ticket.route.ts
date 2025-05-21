import { Router } from "express";
import ticketController from "../controller/ticket.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto";

const ticketRouter = Router();

// All routes require authentication
ticketRouter.use(checkLoggedIn);

// Create ticket
ticketRouter.post("/create", checkAdmin, validationMiddleware(CreateTicketDto), ticketController.createTicket);

// Get all tickets
ticketRouter.get("/all", checkAdmin, ticketController.getAllTickets);

// Get ticket by ID
ticketRouter.get("/:id", checkAdmin, ticketController.getTicketById);

// Delete ticket
ticketRouter.delete("/:id", checkAdmin, ticketController.deleteTicket);

export default ticketRouter;