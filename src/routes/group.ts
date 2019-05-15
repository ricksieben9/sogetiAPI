import { Router } from "express";
import GroupController from "../controllers/GroupController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router({mergeParams: true});

//Get all groups
router.get("/",[checkJwt],GroupController.getAllGroups);

// Get one group
router.get("/:groupId([0-9]+)",[checkJwt],GroupController.getGroupById);

//Create a new group
router.post("/",[checkJwt],GroupController.newGroup);

//Edit one Group
router.patch("/:groupId([0-9]+)",[checkJwt],GroupController.editGroup);

//Delete one group
router.delete("/:groupId([0-9]+)",[checkJwt],GroupController.deleteGroup);

//add dispenser to group
router.post("/:groupId([0-9]+)/dispenser",[checkJwt],GroupController.addDispenserToGroup);

//remove dispenser from group
router.delete("/:groupId([0-9]+)/dispenser/:dispenserId([0-9]+)",[checkJwt],GroupController.deleteDispenserFromGroup);

//add receiver to group
router.post("/:groupId([0-9]+)/receiver",[checkJwt],GroupController.addReceiverToGroup);

//remove receiver from group
router.delete("/:groupId([0-9]+)/receiver/:receiverId([0-9]+)",[checkJwt],GroupController.deleteReceiverFromGroup);

export default router;
