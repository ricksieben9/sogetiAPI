import {EntitySubscriberInterface, EventSubscriber, getRepository} from "typeorm";
import {intake_moment} from "../entity/intake_moment";
import * as admin from "firebase-admin";
import IntakeMomentController from "../controllers/IntakeMomentController"
import Receiver from "../controllers/ReceiverController";

@EventSubscriber()
export class Subscriber implements EntitySubscriberInterface<intake_moment> {
    private timer;

    /**
     * On init start timer.
     */
    listenTo() {
        if (!this.timer) this.startInterval();
        return intake_moment;
    }

    startInterval() {
        this.timer = setInterval(async () => {
            const intakeRepository = getRepository(intake_moment);
            try {
                const intakeMoments = await intakeRepository.find({
                    relations: ["receiver_id", "priority_number", "priority_number.time_to_notificate", "dispenser", "intake_moment_medicines", "intake_moment_medicines.medicine_id"],
                    order: {intake_start_time: "ASC"}
                });
                this.check(intakeMoments);
            } catch (e) {
                console.log(e);
            }
        }, 5000);
    }

    /**
     * Called after load intake moment.
     */
    check(intakeMoments) {
        intakeMoments.forEach(async function (intakeMoment) {
            // Check if intake moment has medicines
            if (intakeMoment.intake_moment_medicines[0].medicine_id !== null) {
                // Array of all medicines if completed_at is not null as true/false
                let medicinesCompleted = intakeMoment.intake_moment_medicines.map(function (t) {
                    return t.completed_at !== null;
                });
                // Get minimum time window
                let minTimeWindow = Math.min.apply(Math, intakeMoment.intake_moment_medicines.map(function (o) {
                    return o.time_window;
                }));
                // Calculate if overtime as boolean true/false
                let overtime = addMinutes(intakeMoment.intake_start_time, minTimeWindow) < new Date();

                // Boolean if overtime (true/false)
                // If array medicinesCompleted has false and is overtime then send request
                if (medicinesCompleted.includes(false) && overtime) {
                    addPriorityTime(intakeMoment.id, intakeMoment.intake_moment_medicines, intakeMoment.priority_number.time_to_notificate.time);
                    sendMessage(await getReceiverGroup(intakeMoment.receiver_id.id), intakeMoment);
                }
            }
        });
    }
}

// Send message to group
function sendMessage(groupId, event) {
    // Send to topic/group
    let topic = 'Group' + groupId;

    // Message body
    let message = {
        notification: {
            "title": "Toedienmoment te laat!",
            "body": "Er is een toedienmoment die over zijn tijdsvenster heen zit"
        },
        data: {
            id: event.id.toString(),
            name: event.receiver_id.name.toString(),
            time: event.intake_start_time.toISOString(),
            dispenser: event.dispenser.name.toString()
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
    return await Receiver.getReceiverGroup(receiverId);
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
