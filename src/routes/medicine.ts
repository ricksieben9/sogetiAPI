import {Router} from "express";
import MedicineController from "../controllers/MedicineController";


const router = Router();

//Get all medicine
router.get("/", [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])] , MedicineController.listAll);

//Create a new medicine
router.post("/", [checkJwt, checkRole(["Admin","Hoofdtoediener"])], MedicineController.newMedicine);

//Edit a medicine
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    MedicineController.editMedicine
);

//Delete a medicine
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    MedicineController.deleteMedicine
);

export default router;
