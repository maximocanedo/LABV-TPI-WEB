'use strict';
import * as u from '../auth';
//import * as db from './../store/patients';
import { GenericQuery } from './commons';
import {
    IPatient,
    IPatientSignRequest,
    IPatientUpdateRequest,
    Patient,
    PatientCommunicationView
} from "../entity/patients";

/**
 * Registra un paciente.
 * @param {IPatientSignRequest} data
 * @returns {Promise<Patient>} Paciente registrado.
 */
export const create = async (data: IPatientSignRequest): Promise<Patient> => {
    return u.post("patients", data)
        .then(response => response.json())
        .catch(err => {
            throw err;
        });
};

export class Query extends GenericQuery<PatientCommunicationView> {
    #dni: string = "";
    constructor(q = "") {
        super(q);
        //super.setLocalDatabase(db);
        super.setPrefix("patients");
    }
}

/**
 * Buscar por ID.
 * @param {number} id 
 * @returns {Promise<IPatient>}
 */
export const findById = async (id: number): Promise<IPatient> => {
    return u.get("patients/id/" + id)
        .then(response => response.json())
        //.then(result => db.update(result))
        .catch(err => {
            throw err;
        });
};

/**
 * Buscar por DNI.
 * @param {string} DNI 
 * @returns {Promise<IPatient>}
 */
export const findByDNI = async (DNI: string): Promise<IPatient> => {
    return u.get("patients/dni/" + DNI)
        .then(response => response.json())
        //.then(result => db.update(result))
        .catch(err => {
            throw err;
        });
};

export const existsByDNI = async (DNI: string): Promise<boolean> => {
    return u.head("patients/dni/" + DNI)
        .then(response => response.ok)
        .catch(err => {
            throw err;
        });
};

/**
 * Actualizar datos de un paciente.
 * @param {number} id 
 * @param {PatientUpdateRequest} data 
 * @returns {Promise<IPatient>}
 */
export const update = async (id: number, data: IPatientUpdateRequest): Promise<IPatient> => {
    return u.patch("patients/id/" + id, data)
        .then(response => response.json())
        //.then(result => db.update(result))
        .catch(err => {
            throw err;
        });
};

/**
 * Deshabilita un elemento.
 * @param {number} id 
 */
export const disable = async (id: number): Promise<boolean> => {
    return u.del("patients/id/" + id)
        .then(response => response.ok)
        .catch(err => {
            throw err;
        });
};

/**
 * Habilita un elemento.
 * @param {number} id 
 */
export const enable = async (id: number): Promise<boolean> => {
    return u.post("patients/id/" + id)
        .then(response => response.ok)
        .catch(err => {
            throw err;
        });
};