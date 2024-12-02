'use strict';

import {Context, createContext} from "react";
import { Doctor, IDoctor } from "src/entity/doctors";
import {IPatient, Patient} from "../../../entity/patients";
import {Appointment, IAppointment} from "../../../entity/appointments";

export interface CurrentAppointmentContext {
    record: Appointment | IAppointment | null;
    updater: (updated: Appointment | IAppointment | null) => void;
}
export const CurrentAppointmentContext: Context<CurrentAppointmentContext> = createContext<CurrentAppointmentContext>({
    record: null,
    updater: (updated: Appointment | IAppointment | null) => {}
});