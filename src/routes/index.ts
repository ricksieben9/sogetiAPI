import {Router} from "express";
import connection from "./connection";
import auth from "./auth";
import user from "./user";
import receiver from "./receiver";
import medicine from "./medicine";
import priority from "./priority";
import log from "./log";
import intakeMoment from "./intakeMoment";
import group from "./group";

const routes = Router();

routes.use("/connection", connection);
routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/receiver", receiver);
routes.use("/medicine", medicine);
routes.use("/priority", priority);
routes.use("/log", log);
routes.use("/intakeMoment", intakeMoment);
routes.use("/group",group);
export default routes;
