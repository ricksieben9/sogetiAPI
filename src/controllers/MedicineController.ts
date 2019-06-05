import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {medicine} from "../entity/medicine";

class MedicineController {


    static listAll = async (req: Request, res: Response) => {
        //Get medicines from database
        const medicineRepository = getRepository(medicine);
        const medicines = await medicineRepository.find();

        //Send the medicines object
        res.send(medicines);
    };

    static newMedicine = async (req: Request, res: Response) => {
        //Get parameters from the body
        const {name, unit, description} = req.body;

        let Medicine = new medicine();
        Medicine.name = name;
        Medicine.unit = unit;
        Medicine.description = description;

        //validate if the parameters are ok
        const errors = await validate(Medicine);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to save. If fails, the medicinename is already in use
        const medicineRepository = getRepository(medicine);
        try {
            await medicineRepository.save(Medicine);
        } catch (error) {
            res.status(409).send({"response": "Naam is al in gebruik."});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response": "Medicine created"});
    };

    static editMedicine = async (req: Request, res: Response) => {

        //Get values from the body
        const {id, name, unit, description} = req.body;

        //Try to find medicine on database
        const medicineRepository = getRepository(medicine);
        let Medicine = new medicine();
        try {
            Medicine = await medicineRepository.findOne(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Medicine not found");
            return;
        }

        //Validate the new values on model
        Medicine.name = name;
        Medicine.unit = unit;
        Medicine.description = description;

        const errors = await validate(Medicine);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means medicinename already in use
        try {
            await medicineRepository.save(Medicine);
            res.send(Medicine);
        } catch (e) {
            res.status(409).send({"response": "Naam is al in gebruik."});
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({"response": "Receiver updated"});
    };

    static deleteMedicine = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const medicineRepository = getRepository(medicine);
        let Medicine: medicine;
        try {
            Medicine = await medicineRepository.findOne(id);
        } catch (error) {
            res.status(404).send({"response":"Receiver not found"});
            return;
        }
        medicineRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default MedicineController;
