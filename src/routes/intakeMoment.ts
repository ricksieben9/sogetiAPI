import { Router } from "express";
import IntakeMomentController from "../controllers/IntakeMomentController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router({mergeParams: true});

//Get all intake Moments
router.get("/", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])],IntakeMomentController.getAllIntakeMoments);

//Get all intake Moments of receiver
router.get("/receiver/:receiverId([0-9]+)", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])],IntakeMomentController.getAllIntakeMomentsOfReceiver);

// Get one intake moment
router.get(
    "/:intakeMomentId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener","Toediener"])],IntakeMomentController.getOneById
);

//Get all intake moments without a dispenser
router.get("/incomplete",[checkJwt, checkRole(["Hoofdtoediener","Toediener"])],IntakeMomentController.getAllIntakeMomentsWithoutDispenser);

//Create a new intake moment
router.post("/",[checkJwt, checkRole(["Hoofdtoediener"])],IntakeMomentController.newIntakeMoment);

//Edit one intake moment
router.patch("/:intakeMomentId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener"])],IntakeMomentController.editIntakeMoment);

//Delete one intake moment
router.delete("/:intakeMomentId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener"])],IntakeMomentController.deleteIntakeMoment);

// get all intake moments (mobile)
router.get("/mobile", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])], IntakeMomentController.getAllIntakeMomentsByDispenser);

// get all details of a intake moment (mobile)
router.get("/mobile/:id([0-9]+)", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])], IntakeMomentController.getIntakeMomentDetail);

// set intake moment medicine on completed (mobile)
router.patch("/mobile/:id([0-9]+)", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])], IntakeMomentController.setIntakeMomentMedicineCompleted);

// remove intake moment medicine completed (mobile)
router.delete("/mobile/:id([0-9]+)", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])], IntakeMomentController.removeIntakeMomentMedicineCompleted);

export default router;
