import {EntitySubscriberInterface, EventSubscriber} from "typeorm";
import {intake_moment} from "../entity/intake_moment";
import * as admin from "firebase-admin";
import IntakeMomentController from "../controllers/IntakeMomentController"

@EventSubscriber()
export class Subscriber implements EntitySubscriberInterface<intake_moment> {

    /**
     * Indicates that this subscriber only listen to intake_moment events.
     */
    listenTo() {
        return intake_moment;
    }

    /**
     * Called after load intake moment.
     */
    afterLoad(event: any) {
        if (event.intake_moment_medicines) {

            // array of all medicines if completed_at is not null as true/false
            let tf = event.intake_moment_medicines.map(function (t) {
                return t.completed_at !== null
            });
            let minTimeWindow = Math.min.apply(Math, event.intake_moment_medicines.map(function (o) {
                return o.time_window;
            }));
            let overtime = addMinutes(event.intake_start_time, minTimeWindow) < new Date();

            // boolean if overtime (true/false)
            // if array has false and is overtime then send request
            if (tf.includes(false) && overtime) {
                addPriorityTime(event.id, event.intake_moment_medicines, event.priority_number.time_to_notificate.time);
                console.log('this is overtime' + event.id);
            }
        }
    }
}

function sendMessage(group) {
    // This registration token comes from the client FCM SDKs.
    let registrationToken = 'd4toKoH9vMM:APA91bEbu-VFs8azWoSitqhka57wUEguoE4zUBevZKf6AVAGaZdlpY1YapvfOpYMlE5_wTDJi_rBKqMsmP8wIRuGmvy32B0q0r-P8F1DhT8H5eDBtqiFAw4GnH2UA6O1Zaz_oV1IQidi';
    let topic = group;

    let message = {
        notification: {
            "title": "Test from server",
            "body": "Test completed!"
        },
        data: {
            id: '15',
        },
        token: registrationToken
        // topic: topic
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

function addPriorityTime(id, intakeMomentMedicines, priorityTime) {
    intakeMomentMedicines.forEach(function (t) {
        t.time_window = +t.time_window + +timeToMinutes(priorityTime);
        IntakeMomentController.addPriorityTimeToTimeWindow(id, t);
    });
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function timeToMinutes(time) {
    let split = time.split(':');
    let hours = split[0];
    let minutes = split[1];
    return (parseInt(hours) * 60 + parseInt(minutes)).toString();
}
