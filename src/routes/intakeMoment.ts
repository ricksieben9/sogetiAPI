import { Router } from "express";
import IntakeMomentController from "../controllers/IntakeMomentController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router({mergeParams: true});

//Get all intake Moments
router.get("/", IntakeMomentController.getAllIntakeMomentsOfReceiver);


// Get one intake moment
router.get(
    "/:intakeMomentId([0-9]+)",IntakeMomentController.getOneById
);

//Get all intake moments
router.get("/incomplete",IntakeMomentController.getAllIntakeMomentsWithoutDispenser);

//Create a new intake moment
router.post("/",IntakeMomentController.newIntakeMoment);

//Edit one intake moment
router.patch("/:intakeMomentId([0-9]+)",IntakeMomentController.editIntakeMoment);

//Delete one intake moment
router.delete("/:intakeMomentId([0-9]+)",IntakeMomentController.deleteIntakeMoment);

// get all intake moments (mobile)
router.get("/mobile", [checkJwt], IntakeMomentController.getAllIntakeMomentsByDispenser);

// get all details of a intake moment (mobile)
router.get("/mobile/:id([0-9]+)", [checkJwt], IntakeMomentController.getIntakeMomentDetail);

// set intake moment medicine on completed (mobile)
router.patch("/mobile/:id([0-9]+)", [checkJwt], IntakeMomentController.setIntakeMomentMedicineCompleted);

// remove intake moment medicine completed (mobile)
router.delete("/mobile/:id([0-9]+)", [checkJwt], IntakeMomentController.removeIntakeMomentMedicineCompleted);

export default router;
