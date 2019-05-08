import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";
import {setIncompleteIntakeNotification} from "../middlewares/setIncompleteIntakeNotification";

const router = Router();
//Login route
router.post("/login", [setIncompleteIntakeNotification], AuthController.login);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
