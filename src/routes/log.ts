import {Router} from "express";
import LogController from "../controllers/LogController";


const router = Router();

//Get all logs
router.get("/", LogController.listAll);

//Create a new log
router.post("/",LogController.newLog);
export default router;
