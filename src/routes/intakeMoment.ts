import {Router} from "express";
import IntakeMomentController from "../controllers/IntakeMomentController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router({mergeParams: true});

//Get all intake Moments
router.get("/", [checkJwt],IntakeMomentController.getAllIntakeMoments);

//Get all intake Moments of receiver
router.get("/receiver/:receiverId([0-9]+)", [checkJwt],IntakeMomentController.getAllIntakeMomentsOfReceiver);

//Get one intake moment
router.get(
    "/:intakeMomentId([0-9]+)",[checkJwt],IntakeMomentController.getOneById
);

//Get all intake moments without a dispenser
router.get("/incomplete",[checkJwt],IntakeMomentController.getAllIntakeMomentsWithoutDispenser);

//Create a new intake moment
router.post("/",[checkJwt],IntakeMomentController.newIntakeMoment);

//Edit one intake moment
router.patch("/:intakeMomentId([0-9]+)",[checkJwt],IntakeMomentController.editIntakeMoment);

//Delete one intake moment
router.delete("/:intakeMomentId([0-9]+)",[checkJwt],IntakeMomentController.deleteIntakeMoment);

//Get all intake moments (mobile)
router.get("/mobile", [checkJwt], IntakeMomentController.getAllIntakeMomentsByDispenser);

//Get all details of a intake moment (mobile)
router.get("/mobile/:id([0-9]+)", [checkJwt], IntakeMomentController.getIntakeMomentDetail);

//Set intake moment medicine on completed (mobile)
router.patch("/mobile/:id([0-9]+)", [checkJwt], IntakeMomentController.setIntakeMomentMedicineCompleted);

//Remove intake moment medicine completed (mobile)
router.delete("/mobile/:id([0-9]+)", [checkJwt], IntakeMomentController.removeIntakeMomentMedicineCompleted);

export default router;
