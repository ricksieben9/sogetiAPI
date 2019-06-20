import { Router } from "express";
import LogController from "../controllers/LogController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";


const router = Router();

//Get all logs
router.get("/", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])], LogController.listAll);

//Create a new log
router.post("/",[checkJwt, checkRole(["Hoofdtoediener"])], LogController.newLog);
export default router;
