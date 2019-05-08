import {NextFunction, Request, Response} from "express";
import {log} from "../entity/log";
import {intake_moment} from "../entity/intake_moment";
import {validate} from "class-validator";
import {getRepository, Not, Raw} from "typeorm";
import {user} from "../entity/user";

export const setIncompleteIntakeNotification = async (req: Request, res: Response, next: NextFunction) => {

    const intakeRepository = getRepository(intake_moment);
    const intakeMoments = await intakeRepository.find({where:{dispenser: null, currentDate: Raw(alias =>`${alias} > NOW()`)} });
    const logRepository = getRepository(log);
    for(let l of intakeMoments)
    {
        const logs = await logRepository.find({where:{intake_moment_id : l.id, category: "toedienmoment", currentDate: Raw(alias =>`${alias} = NOW()`)}});

        if(logs.length == 0) {
            let newLog = new log();
            newLog.category = "toedienmoment";
            newLog.message = "Toedienmoment " + l.id + " zit zonder toediener!";
            newLog.datetime = new Date();
            newLog.intake_moment_id = l.id;
            // Try to save. If fails, the error is reported back
            try {
                logRepository.save(newLog);
            } catch (e) {
                res.status(409).send(e);
                return;
            }
        }
    }

    //If all ok, send 201 response
    res.status(201);

    //Call the next middleware or controller
    next();
};
