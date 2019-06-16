import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {log} from "../entity/log";

class LogController {

    static listAll = async (req: Request, res: Response) => {
        //Get logs from database
        const logRepository = getRepository(log);
        const logs = await logRepository.find();

        //Send the logs object
        res.send(logs);
    };

    static newLog = async (req: Request, res: Response) => {
        //Get parameters from the body
        let Log = new log();
        Log.message = "Toedienmoment heeft een toediener nodig!";
        Log.category = "test";

        //Validate if the parameters are ok
        const errors = await validate(Log);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, the receivername is already in use
        const logRepository = getRepository(log);
        try {
            await logRepository.save(Log);
        } catch (e) {
            res.status(409).send({"response": "Naam is al in gebruik."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Log created"});
    };
}

export default LogController;
