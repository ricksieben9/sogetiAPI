
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import * as admin from "firebase-admin";

//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {
        // Create a new express application instance
        const app = express();
        const serviceAccount = require("../serviceAccountKey.json");

        // Call midlewares
        app.use(cors({
            exposedHeaders: ['token'],
        }));
        app.use(helmet());
        app.use(bodyParser.json());

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://sogeti-fcm.firebaseio.com"
        });

        //Set all routes from routes folder
        app.use("/", routes);

        app.listen(3000, () => {
            console.log("Server started on port 3000!");
        });
    })
    .catch(error => console.log(error));
