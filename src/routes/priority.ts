import { Router } from "express";
import PriorityController from "../controllers/PriorityController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all priorities
router.get(
    "/",
    [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])],
    PriorityController.listAll);

//Create a new priority
router.post("/",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    PriorityController.newPriority);

//Edit one priority
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    PriorityController.editPriority
);

//Delete one priority
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    PriorityController.deletePriority
);

export default router;
