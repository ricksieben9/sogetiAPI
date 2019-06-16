import {Router} from "express";
import UserController from "../controllers/UserController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router();

//Get all users
router.get("/",
    [checkJwt],
    UserController.listAll);

// Get one user
router.get(
    "/:id([0-9]+)",
    UserController.getOneById
);

// Get users by roles
router.get(
    "/roles",
    UserController.getByRoles
);

//Create a new user
router.post("/",
    UserController.newUser);

//Edit one user
router.patch(
    "/:id([0-9]+)",
    UserController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    UserController.deleteUser
);

export default router;
