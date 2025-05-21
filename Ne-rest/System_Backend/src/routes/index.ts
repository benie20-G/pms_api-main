import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import parkingRouter from "./parking.route";
import carRecordRouter from "./carRecordRoutes";
import ticketRouter from "./ticket.route";


const router = Router();

router.use("/auth", authRouter
    /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/user", userRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);

router.use("/parking", parkingRouter
    /*
        #swagger.tags = ['Parking']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/car-records", carRecordRouter
    /*
        #swagger.tags = ['CarRecord']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/tickets", ticketRouter
    /*
        #swagger.tags = ['Ticket']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
// Add more routes here as needed
export default router;
