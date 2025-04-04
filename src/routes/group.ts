import { Router } from "express";
import GroupController from "../controllers/GroupController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router({mergeParams: true});

//Get all groups
router.get("/",[checkJwt, checkRole(["Hoofdtoediener","Toediener"])],GroupController.getAllGroups);

// Get one group
router.get("/:groupId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener","Toediener"])],GroupController.getGroupById);

//Create a new group
router.post("/",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.newGroup);

//Edit one Group
router.patch("/:groupId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.editGroup);

//Delete one group
router.delete("/:groupId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.deleteGroup);

//Add dispenser to group
router.post("/:groupId([0-9]+)/dispenser",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.addDispenserToGroup);

//Remove  dispenser from group
router.delete("/:groupId([0-9]+)/dispenser/:dispenserId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.deleteDispenserFromGroup);

//Add receiver to group
router.post("/:groupId([0-9]+)/receiver",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.addReceiverToGroup);

//Remove  receiver from group
router.delete("/:groupId([0-9]+)/receiver/:receiverId([0-9]+)",[checkJwt, checkRole(["Hoofdtoediener"])],GroupController.deleteReceiverFromGroup);

// get all groups of dispenser (mobile)
router.get("/mobile", [checkJwt, checkRole(["Hoofdtoediener","Toediener"])], GroupController.getGroupsFromDispenser);

export default router;
