import {Router} from "express";
import PriorityController from "../controllers/PriorityController";

const router = Router();

//Get all priorities
router.get(
    "/",
    //[checkJwt],checkRole(["ADMIN"]),
    PriorityController.listAll);

//Create a new priority
router.post("/",
    //[checkJwt, checkRole(["ADMIN"])],
    PriorityController.newPriority);

//Edit one priority
router.patch(
    "/:id([0-9]+)",
    //[checkJwt, checkRole(["ADMIN"])],
    PriorityController.editPriority
);

//Delete one priority
router.delete(
    "/:id([0-9]+)",
    //  [checkJwt, checkRole(["ADMIN"])],
    PriorityController.deletePriority
);

export default router;
