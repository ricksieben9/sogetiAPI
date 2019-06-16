import {Router} from "express";
import GroupController from "../controllers/GroupController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router({mergeParams: true});

//Get all groups
router.get("/",[checkJwt],GroupController.getAllGroups);

//Get one group
router.get("/:groupId([0-9]+)",[checkJwt],GroupController.getGroupById);

//Create a new group
router.post("/",[checkJwt],GroupController.newGroup);

//Edit one Group
router.patch("/:groupId([0-9]+)",[checkJwt],GroupController.editGroup);

//Delete one group
router.delete("/:groupId([0-9]+)",[checkJwt],GroupController.deleteGroup);

//Add dispenser to group
router.post("/:groupId([0-9]+)/dispenser",[checkJwt],GroupController.addDispenserToGroup);

//Remove dispenser from group
router.delete("/:groupId([0-9]+)/dispenser/:dispenserId([0-9]+)",[checkJwt],GroupController.deleteDispenserFromGroup);

//Add receiver to group
router.post("/:groupId([0-9]+)/receiver",[checkJwt],GroupController.addReceiverToGroup);

//Remove receiver from group
router.delete("/:groupId([0-9]+)/receiver/:receiverId([0-9]+)",[checkJwt],GroupController.deleteReceiverFromGroup);

//Get all groups of dispenser (mobile)
router.get("/mobile", [checkJwt], GroupController.getGroupsFromDispenser);

export default router;
