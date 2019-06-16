import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all users
router.get("/",
    [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])],
    UserController.listAll);

// Get one user
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])],
    UserController.getOneById
);

// Get users by roles
router.get(
    "/roles",
    [checkJwt, checkRole(["Admin","Hoofdtoediener","Toediener"])],
    UserController.getByRoles
);

//Create a new user
router.post("/",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    UserController.newUser);

//Edit one user
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    UserController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["Admin","Hoofdtoediener"])],
    UserController.deleteUser
);

export default router;
