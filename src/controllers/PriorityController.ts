import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {priority} from "../entity/priority";

class PriorityController {


    static listAll = async (req: Request, res: Response) => {
        //Get priorities from database
        const priorityRepository = getRepository(priority);
        const priorities = await priorityRepository.find();

        //Send the priorities object
        res.send(priorities);
    };

    static newPriority = async (req: Request, res: Response) => {
        //Get parameters from the body
        const {number, time_to_notificate} = req.body;

        let Priority = new priority();
        Priority.number = number;
        Priority.time_to_notificate = time_to_notificate;

        //validate if the parameters are ok
        const errors = await validate(Priority);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, the prioritynumber is already in use
        const priorityRepository = getRepository(priority);
        try {
            await priorityRepository.save(Priority);
        } catch (error) {
            res.status(409).send({"response": "Nummer is al in gebruik."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Priority created"});
    };

    static editPriority = async (req: Request, res: Response) => {

        //Get values from the body
        const {old_number, number, time_to_notificate} = req.body;

        //Try to find priority on database
        const priorityRepository = getRepository(priority);
        let Priority = new priority();
        try {
            Priority = await priorityRepository.findOne(old_number);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Priority not found");
            return;
        }

        //Validate the new values on model
        Priority.number = number;
        Priority.time_to_notificate = time_to_notificate;

        const errors = await validate(Priority);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means prioritynumber already in use
        try {
            await priorityRepository.save(Priority);
            res.send(Priority);
        } catch (e) {
            res.status(409).send({"response": "Nummer is al in gebruik."});
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({"response": "Priority updated"});
    };

    static deletePriority = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const priorityRepository = getRepository(priority);
        let Priority: priority;
        try {
            Priority = await priorityRepository.findOne(id);
        } catch (error) {
            res.status(404).send({"response":"Receiver not found"});
            return;
        }
        priorityRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default PriorityController;
