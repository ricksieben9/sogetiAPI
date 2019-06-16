import { Router } from "express";
import LogController from "../controllers/LogController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import ReceiverController from "../controllers/ReceiverController";


const router = Router();

//Get all logs
router.get("/", [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])], LogController.listAll);

//Create a new log
router.post("/",[checkJwt, checkRole(["Admin","Hoofdtoediener"])], LogController.newLog);
export default router;
