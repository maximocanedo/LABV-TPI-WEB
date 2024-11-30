'use strict';

import {address, Deletable, Identifiable, Localty, Saveable, sex} from "./commons";
import {IdentifiableUser, IUser, IUserMinimalView} from "./users";
import {Specialty} from "./specialties";

export interface IdentifiableDoctor extends Identifiable {
    file: number;
}
export interface IDoctor extends IdentifiableDoctor, Deletable, Saveable {
    name: string;
    surname: string;
    specialty: Specialty;
    schedules: Schedule[];
    assignedUser: IUserMinimalView | IUser | null;
}
export type weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export interface ScheduleBasicProps {
    beginDay: weekday;
    finishDay: weekday;
    startTime: hour;
    endTime: hour;
}
export type hour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
export type minute = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;
export type second = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;
export type Schedule = Identifiable & Deletable & ScheduleBasicProps;
export type DoctorMinimalView = IDoctor;
export interface DoctorAdditionalProperties {
    sex: sex;
    birth: Date;
    address: address;
    localty: Localty;
    email: string;
    phone: string;
}
export interface Doctor extends IDoctor, DoctorAdditionalProperties {}
export interface DoctorUpdateRequest {
    name?: string;
    surname?: string;
    specialty?: Identifiable;
    user?: IdentifiableUser;
    sex?: sex;
    birth?: Date;
    address?: address;
    localty?: Localty;
    email?: string;
    phone?: string;
    assignedUser?: IdentifiableUser;
}
export interface DoctorRegistrationRequest extends DoctorUpdateRequest {
    file: number;
}
