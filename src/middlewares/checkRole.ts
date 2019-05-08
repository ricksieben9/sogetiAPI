import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { user } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const id = res.locals.jwtPayload.userId;

        //Get user role from the database
        const userRepository = getRepository(user);
        let User: user;
        try {
            User = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send();
        }

        //Check if array of authorized roles includes the user's role
        if (roles.indexOf(User.roles_role.role) > -1) next();
        else res.status(401).send();
    };
};
