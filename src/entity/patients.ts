'use strict';

import {address, Deletable, Identifiable, Localty, Province, Saveable} from "./commons";

export interface IdentifiablePatient extends Identifiable {
    dni: string;
}
export interface PatientBasicProps {
    name: string;
    surname: string;
}
export interface IPatient extends IdentifiablePatient, PatientBasicProps, Saveable, Deletable {}
export type PatientMinimalView = IPatient;
export interface PatientCommunicationProps {
    phone: string;
    email: string;
}
export type PatientCommunicationView = IPatient & PatientCommunicationProps;
export interface PatientPrivateProps {
    address: address;
    localty: Localty;
    province: Province;
    birth: Date;
}
export type Patient = IPatient & PatientCommunicationProps & PatientPrivateProps;
export interface IPatientSignRequest extends PatientBasicProps, PatientCommunicationProps, PatientPrivateProps {
    dni: string;
}
export interface IPatientUpdateRequest {
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    address?: address;
    localty?: Localty;
    province?: Province;
    birth?: Date;
}
