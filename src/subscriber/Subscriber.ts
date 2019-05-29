import {EntitySubscriberInterface, EventSubscriber} from "typeorm";
import {intake_moment} from "../entity/intake_moment";
import * as admin from "firebase-admin";
import IntakeMomentController from "../controllers/IntakeMomentController"
import Receiver from "../controllers/ReceiverController";

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
    async afterLoad(event: any) {
        // Check if intake moment has medicines
        if (event.intake_moment_medicines) {
            // Array of all medicines if completed_at is not null as true/false
            let medicinesCompleted = event.intake_moment_medicines.map(function (t) {
                return t.completed_at !== null
            });
            // Get minimum time window
            let minTimeWindow = Math.min.apply(Math, event.intake_moment_medicines.map(function (o) {
                return o.time_window;
            }));
            // Calculate if overtime as boolean true/false
            let overtime = addMinutes(event.intake_start_time, minTimeWindow) < new Date();

            // Boolean if overtime (true/false)
            // If array medicinesCompleted has false and is overtime then send request
            if (medicinesCompleted.includes(false) && overtime) {
                addPriorityTime(event.id, event.intake_moment_medicines, event.priority_number.time_to_notificate.time);
                sendMessage(await getReceiverGroup(event.receiver_id.id), event.id);
                console.log('this is overtime' + event.id);
            }
        }
    }
}

// Send message to group
function sendMessage(groupId, intakeMomentId) {
    // Send to topic/group
    let topic = 'Group' + groupId;

    // Message body
    let message = {
        notification: {
            "title": "Toedienmoment overtijd!",
            "body": "Er is een toedienmoment die over zijn tijdsvenster heen zit"
        },
        data: {
            id: intakeMomentId.toString(),
        },
        topic: topic
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

// Add priority time time to medicine time window to extend the intake moment
function addPriorityTime(id, intakeMomentMedicines, priorityTime) {
    intakeMomentMedicines.forEach(function (t) {
        t.time_window = +t.time_window + +timeToMinutes(priorityTime);
        IntakeMomentController.addPriorityTimeToTimeWindow(id, t);
    });
}

// Get first group of receiver
async function getReceiverGroup(receiverId) {
    let receiver = await Receiver.getReceiverGroup(receiverId);
    return receiver.groups[0].id;
}

// DateTime add minutes
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// Split HH:MM:ss to minutes
function timeToMinutes(time) {
    let split = time.split(':');
    let hours = split[0];
    let minutes = split[1];
    return (parseInt(hours) * 60 + parseInt(minutes)).toString();
}
