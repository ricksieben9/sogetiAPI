import { Router } from "express";
import MedicineController from "../controllers/MedicineController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import ReceiverController from "../controllers/ReceiverController";



const router = Router();

//Get all medicine
router.get("/", MedicineController.listAll);

//Create a new medicine
router.post("/",MedicineController.newMedicine);

//Edit a medicine
router.patch(
    "/:id([0-9]+)",
    // [checkJwt, checkRole(["ADMIN"])],
    MedicineController.editMedicine
);

//Delete a medicine
router.delete(
    "/:id([0-9]+)",
    // [checkJwt, checkRole(["ADMIN"])],
    MedicineController.deleteMedicine
);

export default router;
