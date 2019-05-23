import {EntitySubscriberInterface, EventSubscriber} from "typeorm";
import {intake_moment} from "../entity/intake_moment";

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
            // all time windows of the intake moment medicine(s)
            let time_windows = event.intake_moment_medicines.map(function (t) {
                // return true or false if time window reached and is not completed
                return (addMinutes(event.intake_start_time, t.time_window) < new Date() && t.completed_at !== null) ||
                    !(addMinutes(event.intake_start_time, t.time_window) < new Date() && t.completed_at === null);
            });
            // check if a medicine is overtime
            if (time_windows.includes(false)) {
                console.log('this is overtime' + event.id);
            } else {
                console.log('this is not overtime' + event.id);
            }
        }
    }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
