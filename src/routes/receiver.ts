import { Router } from "express";
import ReceiverController from "../controllers/ReceiverController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";


const router = Router();

//Get all receivers
router.get("/", ReceiverController.listAll);

// Get one receiver
router.get(
    "/:id([0-9]+)",
    //[checkJwt, checkRole(["ADMIN"])],
    ReceiverController.getOneById
);

//Create a new receiver
router.post("/",ReceiverController.newReceiver);

//Edit one receiver
router.patch(
    "/:id([0-9]+)",
   // [checkJwt, checkRole(["ADMIN"])],
    ReceiverController.editReceiver
);

//Delete one receiver
router.delete(
    "/:id([0-9]+)",
   // [checkJwt, checkRole(["ADMIN"])],
    ReceiverController.deleteReceiver
);

export default router;
