import { Router } from "express";
import ReceiverController from "../controllers/ReceiverController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";


const router = Router();

//Get all receivers
router.get("/", [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])], ReceiverController.listAll);

// Get one receiver
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])],
    ReceiverController.getOneById
);

//Create a new receiver
router.post("/",[checkJwt, checkRole(["Admin","Hoofdtoediener"])], ReceiverController.newReceiver);

//Edit one receiver
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    ReceiverController.editReceiver
);

//Delete one receiver
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    ReceiverController.deleteReceiver
);

export default router;
