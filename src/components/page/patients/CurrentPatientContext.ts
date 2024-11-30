'use strict';

import {Context, createContext} from "react";
import { Doctor, IDoctor } from "src/entity/doctors";
import {IPatient, Patient} from "../../../entity/patients";

export interface CurrentPatientContext {
    record: Patient | IPatient | null;
    updater: (updated: Patient | IPatient | null) => void;
}
export const CurrentPatientContext: Context<CurrentPatientContext> = createContext<CurrentPatientContext>({
    record: null,
    updater: (updated: Patient | IPatient | null) => {}
});