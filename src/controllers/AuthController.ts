import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {user} from "../entity/user";
import config from "../config/config";
import {roles} from "../entity/roles";

class AuthController {
    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let {username, password} = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }
        let role, name, isFirst;
        //Get user from database
        const userRepository = getRepository(user);
        let User: user;
        try {
            User = await userRepository.findOne({where: {email: username}});
            role = User.roles_role.role;
            name = User.name;
            isFirst = (!User.isfirst ? null : User.isfirst);
        } catch (error) {
            res.status(401).send({"response": "Email en/of wachtwoord is verkeerd"});
            return;
        }

        //Check if encrypted password match
        if (!User.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send({"response": "Email en/of wachtwoord is verkeerd"});
            return;
        }

        // Check if authorized to login
        if(role === 'Toediener'){
            res.status(401).send({"response": "U bent niet gemachtigd om het portaal te gebruiken!"});
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            {userId: User.id, username: User.email},
            config.jwtSecret,
            {expiresIn: "1h"}
        );
        //Send the jwt in the response
        res.send({username, token, role, name, isFirst});
    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const {oldPassword, newPassword} = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        //Get user from the database
        const userRepository = getRepository(user);
        let User: user;
        try {
            User = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send({"response": "Het huidige wachtwoord en/of nieuwe wachtwoord is verkeerd!"});
            return;
        }

        //Check if old password matches
        if (!User.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send({"response": "Het huidige wachtwoord en/of nieuwe wachtwoord is verkeerd!"});
            return;
        }

        //Check if old password matches new password
        if (!User.checkIfUnencryptedPasswordIsValid(oldPassword) === !User.checkIfUnencryptedPasswordIsValid(newPassword)) {
            res.status(401).send({"response": "Het huidige wachtwoord mag niet gelijk zijn aan het nieuwe wachtwoord!"});
            return;
        }

        //Validate de model (password length)
        User.password = newPassword;
        const errors = await validate(User);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        //Hash the new password and save
        User.hashPassword();
        User.isfirst = false;
        userRepository.save(User);

        res.status(204).send();
    };

}

export default AuthController;
