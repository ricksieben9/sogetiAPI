import {Router} from "express";
import ReceiverController from "../controllers/ReceiverController";


const router = Router();

//Get all receivers
router.get("/", ReceiverController.listAll);

// Get one receiver
router.get(
    "/:id([0-9]+)",
    ReceiverController.getOneById
);

//Create a new receiver
router.post("/",ReceiverController.newReceiver);

//Edit one receiver
router.patch(
    "/:id([0-9]+)",
    ReceiverController.editReceiver
);

//Delete one receiver
router.delete(
    "/:id([0-9]+)",
    ReceiverController.deleteReceiver
);

export default router;
