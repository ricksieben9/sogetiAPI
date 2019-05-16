import {Request, Response} from "express";
import {getConnection, getRepository} from "typeorm";
import {validate} from "class-validator";

import {group} from "../entity/group";
import {group_dispensers} from "../entity/group_dispensers";

class GroupController {

    static getAllGroups = async (req: Request, res: Response) => {

        //Get groups from database
        const groupRepository = getRepository(group);
        try {
            const groups = await groupRepository.find();
            res.send(groups);

        } catch (error) {
            res.status(404).send("groups not found");
        }
    };

    static getGroupById = async (req: Request, res: Response) => {
        const id: number = req.params.groupId;

        //Get groups from database
        const groupRepository = getRepository(group);
        try {
            const group = await groupRepository.find({relations:["group_dispensers","receivers"],where:{id: id}});
            res.send(group);

        } catch (error) {
            res.status(404).send(error);
        }
    };

    static newGroup = async (req:Request, res:Response) => {
        //Get parameters from the body
        const {name,group_dispensers,receivers} = req.body;
        let Group = new group();
        Group.name = name;
        Group.group_dispensers = group_dispensers;
        Group.receivers = receivers;

        //validate if the parameters are ok
        const errors = await validate(Group);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, A response is sent to the client
        const groupRepository = getRepository(group);
        try {
            await groupRepository.save(Group);
        } catch (e) {
            res.status(409).send({"response": "Er is iets fout gegaan bij het aanmaken van de groep."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Group created"});
    };

    static editGroup = async (req:Request, res:Response) => {
        //Get the ID from the url
        const id = req.params.groupId;

        const groupRepository = getRepository(group);
        let Group;

        //get new values from client
        const {name,group_dispensers,receivers} = req.body;

        //get group from database
        try {
            Group = await groupRepository.findOne(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Group not found");
            return;
        }

        //set values of group
        Group.name = name;
        Group.group_dispensers = group_dispensers;
        Group.receivers = receivers;

        //validate if the parameters are ok
        const errors = await validate(Group);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Delete original group (required because TypeORM one-to-many / many to many bug)
        try  {
            let group = await groupRepository.findOne(id);
            await groupRepository.remove(group);
        } catch(error){
            res.status(409).send({"response": "Er is iets fout gegaan bij het wijzigen van de groep."});
            return;
        }

        //Try to save. If fails, A response is sent to the client
        try {
            await groupRepository.save(Group);
        } catch (e) {
            res.status(409).send({"response": "Er is iets fout gegaan bij het wijzigen van de groep."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Group updated"});
    };

    static deleteGroup = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.groupId;

        const groupRepository = getRepository(group);
        try {
            let group = await groupRepository.findOne(id);
            await groupRepository.remove(group);

            //After all send a 204 (no content, but accepted) response
            res.status(204).send();
        } catch (error) {
            res.status(404).send({"response":"Group not found"});
            return;
        }
    };

    static addDispenserToGroup = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.groupId;

        //get dispenser from client
        const {group_dispenser} = req.body;

        const groupRepository = getRepository(group);
        let Group;

        //get group from database
        try {
            Group = await groupRepository.findOne({relations:["group_dispensers"],where:{id: id}});
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Group not found."});
            return;
        }

        //Try to save. If fails, A response is sent to the client
        try {
            Group.group_dispensers.push(group_dispenser);
            await groupRepository.save(Group);
        } catch (e) {
            res.status(409).send({"response": "Er is iets fout gegaan bij het toevoegen van een toediener aan de groep."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Dispenser added to group"});
    };

    static deleteDispenserFromGroup = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.groupId;
        const dispenser_id = req.params.dispenserId;

        const groupRepository = getRepository(group);

        //get group from database
        try {
            await groupRepository.findOne(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Group not found."});
            return;
        }
        //Try to save. If fails, A response is sent to the client
        try {
            const groupDispenserRepository = getRepository(group_dispensers);
            let dispenser = await groupDispenserRepository.findOne({user_id: dispenser_id, groups_id: id});
            if (!dispenser){
                res.status(409).send({"response": "Dispenser not found"});
                return;
            }
            await groupDispenserRepository.delete({user_id: dispenser_id, groups_id: id})
        } catch (e) {
            res.status(409).send({"response": "Er is iets fout gegaan bij het verwijderen van een toediener uit de groep."});
            return;
        }

        //If all ok, send 200 response
        res.status(200).send({"response": "Dispenser deleted from group"});
    };

    static addReceiverToGroup = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.groupId;

        //get dispenser from client
        const {receiver} = req.body;

        const groupRepository = getRepository(group);
        let Group;

        //get group from database
        try {
            Group = await groupRepository.findOne(id,{relations:["receivers"]});
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Group not found."});
            return;
        }
        //Send an error when receiver is already in group
        let duplicateReceiver = Group.receivers.find(r => r.id === receiver.id);
        if (duplicateReceiver)
        {
            res.status(409).send({"response": "Deze ontvanger zit al in deze groep."});
            return;
        }

        //Try to save. If fails, A response is sent to the client
        try {
            Group.receivers.push(receiver);
            await groupRepository.save(Group);
        } catch (e) {
            res.status(409).send({"response": "Er is iets fout gegaan bij het toevoegen van een ontvanger aan de groep."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Receiver added to group"});
    };

    static deleteReceiverFromGroup = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.groupId;
        const receiver_id = req.params.receiverId;
        const groupRepository = getRepository(group);
        let Group;

        //get group from database
        try {
            Group = await groupRepository.findOne(id,{relations:["receivers"]});
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Group not found."});
            return;
        }
        //Send an error when receiver is not in group
        let receiver = Group.receivers.find(r => r.id === parseInt(receiver_id));
        if (!receiver)
        {
            res.status(409).send({"response": "Receiver not found."});
            return;
        }

        //get group from database and remove receiver
        try {
            await getConnection()
                .createQueryBuilder()
                .relation(group, "receivers")
                .of(id)
                .remove(receiver_id);
        } catch (error) {
            //If an error occurs, send a response to the client
            res.status(409).send({"response": "Er is iets fout gegaan bij het verwijderen van een ontvanger uit de groep."});
            return;
        }

        //If all ok, send 200 response
        res.status(200).send({"response": "Receiver deleted from group"});
    };
}

export default GroupController;
