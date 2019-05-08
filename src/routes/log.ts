import { Router } from "express";
import LogController from "../controllers/LogController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import ReceiverController from "../controllers/ReceiverController";


const router = Router();

//Get all logs
router.get("/", LogController.listAll);

//Create a new log
router.post("/",LogController.newLog);
export default router;
