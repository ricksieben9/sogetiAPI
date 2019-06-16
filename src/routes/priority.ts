import {Router} from "express";
import PriorityController from "../controllers/PriorityController";

const router = Router();

//Get all priorities
router.get(
    "/",
    PriorityController.listAll);

//Create a new priority
router.post("/",
    PriorityController.newPriority);

//Edit one priority
router.patch(
    "/:id([0-9]+)",
    PriorityController.editPriority
);

//Delete one priority
router.delete(
    "/:id([0-9]+)",
    PriorityController.deletePriority
);

export default router;
