import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import {user} from "../entity/user";

class UserController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const userRepository = getRepository(user);
        const users = await userRepository.find();

        //Send the users object
        res.send(users);
    };

    static getByRoles = async (req: Request, res: Response) => {
        //Get the parameters in JSON from the url
        const roles = JSON.parse(req.query.roles);

        //Get the user from database
        const userRepository = getRepository(user);
        try {
            const User = await userRepository.createQueryBuilder()
                .select(["name", "roles_role", "email", "id"])
                .where("roles_role IN (:role)", { role: roles.roleList })
                .getRawMany();

            res.send(User);

        } catch (error) {
            res.status(404).send("User not found");
        }
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = req.params.id;

        //Get the user from database
        const userRepository = getRepository(user);
        try {
            const User = await userRepository.createQueryBuilder().select(["id", "name", "roles_role", "email"]).where({ id: id }).getRawMany();
            res.send(User);
        } catch (error) {
            res.status(404).send({"error": "User not found"});
        }
    };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, email, password, roles_role } = req.body;
        let User = new user();
        User.email = email;
        User.password = password;
        User.roles_role = roles_role;
        User.name = name;

        //Validate if the parameters are ok
        const errors = await validate(User);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the password, to securely store on DB
        User.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(user);
        try {
            await userRepository.save(User);
        } catch (e) {
            if(e.message.includes('email_UNIQUE')) {
                res.status(409).send({"type": "email", "response": "Dit emailadres is al in gebruik!"});
                return;
            }

            if(e.message.includes('name_UNIQUE')){
                res.status(409).send({"type":"username","response":"Deze gebruikersnaam bestaat al!"});
                return;
            }
            res.status(409).send({"type": "undefined", "response": "Bad Request!"});
            return;
        }

        //If all ok, send 201 response
        res.status(201).send({"response":"User created"});
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        let { name, email, roles_role } = req.body;

        //Try to find user on database
        const userRepository = getRepository(user);
        let User;
        try {
            User = await userRepository.findOne(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send({"response":"Gebruiker niet gevonden!"});
            return;
        }

        //Validate the new values on model
        User.name = name;
        User.roles_role = roles_role;
        User.email = email;
        const errors = await validate(User);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(User);
            
        } catch (e) {
            res.status(409).send({"response":"Bad request!"});
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send({"response": "User updated"});
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(user);
        let User: user;
        try {
            User = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(404).send({"response":"User not found"});
            return;
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}

export default UserController;

