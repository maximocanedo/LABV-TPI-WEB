'use strict';

import {Doctor, DoctorMinimalView, IdentifiableDoctor, IDoctor} from "./doctors";
import {
    IdentifiablePatient,
    IPatient, Patient,
    PatientCommunicationView,
    PatientMinimalView
} from "./patients";
import {Deletable, Identifiable, Saveable} from "./commons";

export type AppointmentStatus = 'PRESENT' | 'ABSENT' | 'PENDING' | 'CANCELLED';

export interface AppointmentRegistrationRequest {
    date: Date;
    remarks: string;
    doctor: IdentifiableDoctor; // TODO AssignedDoctor prop here.
    patient: IdentifiablePatient;
}
export interface AppointmentBasicProps {
    remarks: string;
    status: AppointmentStatus;
}
export interface AppointmentBasicDoctorAndPatientProps {
    date: Date;
    assignedDoctor: IDoctor;
    patient: IPatient;
}
export interface IAppointment extends Identifiable, Deletable, Saveable, AppointmentBasicProps, AppointmentBasicDoctorAndPatientProps {

}
export type AppointmentMinimalView = IAppointment & {
    assignedDoctor: DoctorMinimalView;
    patient: PatientMinimalView;
};
export type AppointmentCommunicationView = IAppointment & {
    assignedDoctor: DoctorMinimalView;
    patient: PatientCommunicationView;
};
export type Appointment = IAppointment & {
    assignedDoctor: Doctor;
    patient: Patient;
}