import {Request, Response} from "express";
import {getRepository, MoreThan} from "typeorm";
import {validate} from "class-validator";
import {intake_moment} from "../entity/intake_moment";
import {intake_moment_medicines} from "../entity/intake_moment_medicines";

class IntakeMomentController {

    static getAllIntakeMoments = async (req: Request, res: Response) => {

        //Get intakeMoments from database
        const intakeRepository = getRepository(intake_moment);
        try {
            const intakeMoments = await intakeRepository.find({
                relations: ["receiver_id", "priority_number", "dispenser", "intake_moment_medicines"],
                order: {intake_start_time: "ASC"}
            });
            res.send(intakeMoments);

        } catch (error) {
            res.status(404).send("Intake moments not found");
        }
    };

    static getAllIntakeMomentsOfReceiver = async (req: Request, res: Response) => {
        //Get the receiver ID from the request
        const id = req.params.receiverId;

        //Get intakeMoments from database
        const intakeRepository = getRepository(intake_moment);
        try {
            const intakeMoments = await intakeRepository.find({
                relations: ["receiver_id", "priority_number", "dispenser", "intake_moment_medicines"],
                where: {receiver_id: id},
                order: {intake_start_time: "ASC"}
            });
            res.send(intakeMoments);

        } catch (error) {
            res.status(404).send("Intake moments not found");
        }
    };

    static getAllIntakeMomentsWithoutDispenser = async (req: Request, res: Response) => {
        const intakeRepository = getRepository(intake_moment);
        const intakeMoments = await intakeRepository.find({
            relations: ["receiver_id"],
            where: {dispenser: null, intake_start_time: MoreThan(Date.now())},
            order: {intake_start_time: "ASC"}
        });
        res.send(intakeMoments);
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = req.params.intakeMomentId;

        //Get the intake moment from the database
        const intakeRepository = getRepository(intake_moment);
        try {
            const IntakeMoment = await intakeRepository.find({
                relations: ["receiver_id", "priority_number", "dispenser", "intake_moment_medicines"],
                where: {id: id}
            });
            res.send(IntakeMoment);

        } catch (error) {
            res.status(404).send("Intake moment not found");
        }
    };

    static newIntakeMoment = async (req: Request, res: Response) => {
        //Get parameters from the body
        let intakeMomentData = req.body;
        let IntakeMoment = new intake_moment();


        IntakeMoment.dispenser = intakeMomentData['dispenser_id'] ? intakeMomentData['dispenser_id'] : null;
        IntakeMoment.receiver_id = intakeMomentData['receiver_id'];
        IntakeMoment.intake_start_time = intakeMomentData['intake_start_time'];
        IntakeMoment.intake_end_time = intakeMomentData['intake_end_time'];
        IntakeMoment.priority_number = intakeMomentData['priority_number'];
        IntakeMoment.remark = intakeMomentData['remark'];
        IntakeMoment.intake_moment_medicines = intakeMomentData['intake_moment_medicines'];

        //validate if the parameters are ok
        const errors = await validate(IntakeMoment);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, the error is reported back
        const receiverRepository = getRepository(intake_moment);
        try {
            await receiverRepository.save(IntakeMoment);
        } catch (e) {
            res.status(409).send(e);
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Intake Moment created"});
    };

    static editIntakeMoment = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.intakeMomentId;

        //Get values from the body
        let intakeMomentData = req.body;

        //Try to find receiver on database
        const intakeRepository = getRepository(intake_moment);
        let IntakeMoment;
        try {
            IntakeMoment = await intakeRepository.findOne(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Intake moment not found");
            return;
        }

        //Validate the new values on model
        IntakeMoment.dispenser = intakeMomentData['dispenser_id'] ? intakeMomentData['dispenser_id'] : null;
        IntakeMoment.receiver_id = intakeMomentData['receiver_id'];
        IntakeMoment.intake_start_time = intakeMomentData['intake_start_time'];
        IntakeMoment.intake_end_time = intakeMomentData['intake_end_time'];
        IntakeMoment.priority_number = intakeMomentData['priority_number'];
        IntakeMoment.remark = intakeMomentData['remark'];
        IntakeMoment.intake_moment_medicines = intakeMomentData['intake_moment_medicines'];
        const errors = await validate(IntakeMoment);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Delete all original medicine from intakeMoment
        const intakeMomentMedicinesRepository = getRepository(intake_moment_medicines);
        try {
            await intakeMomentMedicinesRepository.delete({intake_moment_id: id});
        } catch (error) {
            res.status(409).send(error);
            return;
        }

        //Try to save, if fails, the error is reported back
        try {
            await intakeRepository.save(IntakeMoment);
            res.status(200).send(IntakeMoment);
        } catch (e) {
            res.status(409).send(e);
            return;
        }
    };

    static deleteIntakeMoment = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.intakeMomentId;
        const intakeRepository = getRepository(intake_moment);
        let IntakeMoment: intake_moment;
        try {
            IntakeMoment = await intakeRepository.findOne(id);
        } catch (error) {
            res.status(404).send({"response": "Intake moment not found"});
            return;
        }
        await intakeRepository.delete(IntakeMoment);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    // Get all intake moment by dispenser(mobile)
    static getAllIntakeMomentsByDispenser = async (req: Request, res: Response) => {
        const {userId} = res.locals.jwtPayload;
        const intakeMomentRepository = getRepository(intake_moment);
        let intakeMoment;
        try {
            intakeMoment = await intakeMomentRepository.find({
                relations: ["receiver_id", "priority_number", "priority_number.time_to_notificate", "intake_moment_medicines", "intake_moment_medicines.medicine_id"],
                where: {dispenser: userId}
            });
        } catch (error) {
            console.log(error);
            //If not found, send a 404 response
            res.status(404).send({"response": "Toedienmoment niet gevonden!"});
            return;
        }


        //Send the intake moment object
        res.status(200).send(intakeMoment);
    };

    // Get intake moment detail by id and user (mobile)
    static getIntakeMomentDetail = async (req: Request, res: Response) => {
        const {userId} = res.locals.jwtPayload;
        const id: number = req.params.id;
        const intakeMomentRepository = getRepository(intake_moment);
        let intakeMoment;
        try {
            intakeMoment = await intakeMomentRepository.find({
                relations: ["receiver_id", "priority_number", "priority_number.time_to_notificate", "intake_moment_medicines", "intake_moment_medicines.medicine_id"],
                where: {dispenser: userId, id: id}
            });
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Toedienmoment gegevens niet gevonden!"});
            return;
        }
        //Send the users object
        res.status(200).send(intakeMoment);
    };

    // set intake moment medicine on completed (mobile)
    static setIntakeMomentMedicineCompleted = async (req: Request, res: Response) => {
        const id = req.params.id;
        let {medicine_id, completed_at} = req.body;

        const intakeMomentMedicineRepository = getRepository(intake_moment_medicines);
        let IntakeMomentMedicine: intake_moment_medicines;
        try {
            IntakeMomentMedicine = await intakeMomentMedicineRepository.findOne({
                relations: ["intake_moment_id", "medicine_id"],
                where: {
                    intake_moment_id: id,
                    medicine_id: medicine_id.id,
                }
            });
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Toedienmoment medicijn niet gevonden!"});
            return;
        }

        IntakeMomentMedicine.completed_at = completed_at.toString();

        //Try to safe, if fails, that means intake moment medicine already in use
        try {
            await intakeMomentMedicineRepository.save(IntakeMomentMedicine);
        } catch (e) {
            res.status(409).send({"response": "Bad request!"});
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({"response": "Toedienmoment aangepast"});
    };

    // remove intake moment medicine on completed (mobile)
    static removeIntakeMomentMedicineCompleted = async (req: Request, res: Response) => {
        const id = req.params.id;
        let {medicine_id} = req.body;

        const intakeMomentMedicineRepository = getRepository(intake_moment_medicines);
        let IntakeMomentMedicine: intake_moment_medicines;
        try {
            IntakeMomentMedicine = await intakeMomentMedicineRepository.findOne({
                relations: ["intake_moment_id", "medicine_id"],
                where: {
                    intake_moment_id: id,
                    medicine_id: medicine_id.id,
                }
            });

        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response": "Toedienmoment medicijn niet gevonden!"});
            return;
        }
        IntakeMomentMedicine.completed_at = null;

        //Try to safe, if fails, that means intake moment medicine already in use
        try {
            await intakeMomentMedicineRepository.save(IntakeMomentMedicine);

        } catch (e) {
            res.status(409).send({"response": "Bad request!"});
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({"response": "Toedienmoment aangepast"});
    };

    // add priority time to time_window intake moment medicine
    static addPriorityTimeToTimeWindow = async (intakeMomentId, medicines) => {
        const id = intakeMomentId;
        let medicine = medicines;
        const intakeMomentMedicineRepository = getRepository(intake_moment_medicines);
        let IntakeMomentMedicine: intake_moment_medicines;
        try {
            IntakeMomentMedicine = await intakeMomentMedicineRepository.findOne({
                relations: ["intake_moment_id", "medicine_id"],
                where: {
                    intake_moment_id: id,
                    medicine_id: medicine.medicine_id.id,
                }
            });
        } catch (error) {
            //If not found, return false
            return false;
        }
        IntakeMomentMedicine.time_window = medicine.time_window;
        //Try to safe, if fails, that means intake moment medicine already in use
        try {
            await intakeMomentMedicineRepository.save(IntakeMomentMedicine);

        } catch (e) {
            return false;
        }
        return true;
    };
}

export default IntakeMomentController;
