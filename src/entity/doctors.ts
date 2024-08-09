'use strict';

import {address, Deletable, Identifiable, Localty, Saveable, sex} from "./commons";
import {IdentifiableUser, IUserMinimalView} from "./users";
import {Specialty} from "./specialties";

export interface IdentifiableDoctor extends Identifiable {
    file: number;
}
export interface IDoctor extends IdentifiableDoctor, Deletable, Saveable {
    name: string;
    surname: string;
    specialty: Specialty;
    schedules: Schedule[];
    assignedUser: IUserMinimalView | null;
}
export type weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export interface ScheduleBasicProps {
    beginDay: weekday;
    finishDay: weekday;
    startTime: string;
    endTime: string;
}
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
}
export interface DoctorRegistrationRequest extends DoctorUpdateRequest {
    file: number;
}
