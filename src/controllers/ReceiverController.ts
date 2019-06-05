import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {receiver} from "../entity/receiver";

class ReceiverController {

    static listAll = async (req: Request, res: Response) => {
        //Get receivers from database
        const receiverRepository = getRepository(receiver);
        const receivers = await receiverRepository.find();

        //Send the receivers object
        res.send(receivers);
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = req.params.id;

        //Get the receiver from database
        const receiverRepository = getRepository(receiver);
        try {
            const Receiver = await receiverRepository.createQueryBuilder().select(["id", "name"]).where({id: id}).getRawMany();
            res.send(Receiver);

        } catch (error) {
            res.status(404).send("Receiver not found");
        }
    };

    static newReceiver = async (req: Request, res: Response) => {
        //Get parameters from the body
        let receivername = req.body;
        let Receiver = new receiver();


        Receiver.name = receivername['name'];

        //validate if the parameters are ok
        const errors = await validate(Receiver);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, the receivername is already in use
        const receiverRepository = getRepository(receiver);
        try {
            await receiverRepository.save(Receiver);
        } catch (e) {
            res.status(409).send({"response": "Naam is al in gebruik."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Receiver created"});
    };

    static editReceiver = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const receiverName = req.body;

        //Try to find receiver on database
        const receiverRepository = getRepository(receiver);
        let Receiver;
        try {
            Receiver = await receiverRepository.findOne(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Receiver not found");
            return;
        }

        //Validate the new values on model
        Receiver.name = receiverName['name'];
        const errors = await validate(Receiver);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means receivername already in use
        try {
            await receiverRepository.save(Receiver);
            res.send(Receiver);
        } catch (e) {
            res.status(409).send({"response": "Naam is al in gebruik."});
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({"response": "Receiver updated"});
    };

    static deleteReceiver = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const receiverRepository = getRepository(receiver);
        let Receiver: receiver;
        try {
            Receiver = await receiverRepository.findOne(id);
        } catch (error) {
            res.status(404).send({"response":"Receiver not found"});
            return;
        }
        receiverRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default ReceiverController;
