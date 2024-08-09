'use strict';

import {Context, createContext} from "react";
import { Doctor, IDoctor } from "src/entity/doctors";

export interface CurrentDoctorContext {
    record: Doctor | IDoctor | null;
    updater: (updated: Doctor | IDoctor | null) => void;
}
export const CurrentDoctorContext: Context<CurrentDoctorContext> = createContext<CurrentDoctorContext>({
    record: null,
    updater: (updated: Doctor | IDoctor | null) => {}
});