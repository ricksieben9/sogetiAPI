import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";
import {setIncompleteIntakeNotification} from "../middlewares/setIncompleteIntakeNotification";
import {checkRole} from "../middlewares/checkRole";

const router = Router();
//Login route
router.post("/login", [setIncompleteIntakeNotification], AuthController.login);

//Change my password
router.post("/change-password", [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])], AuthController.changePassword);

//Refresh Token of inlog with PIN
router.post("/refreshToken", AuthController.refreshToken);

export default router;
