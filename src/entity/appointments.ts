'use strict';

import {Doctor, DoctorMinimalView, IdentifiableDoctor, IDoctor} from "./doctors";
import {
    IdentifiablePatient,
    IPatient, Patient,
    PatientCommunicationView,
    PatientMinimalView
} from "./patients";
import {Deletable, Identifiable, Saveable} from "./commons";

export type AppointmentStatus = 'PRESENT' | 'ABSENT' | 'PENDING';

export interface AppointmentRegistrationRequest {
    date: Date;
    doctor: IdentifiableDoctor; // TODO AssignedDoctor prop here.
    patient: IdentifiablePatient;
}
export interface AppointmentBasicProps {
    remarks: string;
    status: AppointmentStatus;
}
export interface AppointmentBasicDoctorAndPatientProps {
    date: Date;
    doctor: IDoctor;
    patient: IPatient;
}
export interface IAppointment extends Identifiable, Deletable, Saveable, AppointmentBasicProps, AppointmentBasicDoctorAndPatientProps {

}
export type AppointmentMinimalView = IAppointment & {
    doctor: DoctorMinimalView;
    patient: PatientMinimalView;
};
export type AppointmentCommunicationView = IAppointment & {
    doctor: DoctorMinimalView;
    patient: PatientCommunicationView;
};
export type Appointment = IAppointment & {
    doctor: Doctor;
    patient: Patient;
}