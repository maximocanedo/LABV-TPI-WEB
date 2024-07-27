'use strict';
import * as u from '../auth';
import { GenericQuery } from './commons';
import {
    AppointmentBasicProps,
    AppointmentCommunicationView,
    AppointmentMinimalView,
    AppointmentRegistrationRequest, AppointmentStatus,
    IAppointment
} from "../entity/appointments";
import {IdentifiableDoctor} from "../entity/doctors";
import {IdentifiablePatient} from "../entity/patients";
import App from "../App";
//import * as db from './../store/appointment.';
/// <reference path="../types/entities.js" />

/**
 * Registra un turno.
 * @param {AppointmentRegistrationRequest} data Datos del turno.
 * @returns {Promise<IAppointment>} Turno creado.
 */
export const create = async (data: AppointmentRegistrationRequest): Promise<AppointmentCommunicationView> => {
    return u.post("appointments", data)
        .then(response => response.json())
        //.then(created => db.update(created))
        .catch(err => {
            throw err;
        });
};
/**
 * Busca un turno por id.
 * @param {number} id Id del turno.
 * @returns {Promise<IAppointment>}
 */
export const findById = async (id: number): Promise<IAppointment> => {
    return u.get(`appointments/id/${id}`)
        .then(response => response.json())
        //.then(result => db.update(result))
        .catch(err => {
            throw err;
        });
};

/**
 * @class
 * @extends GenericQuery<Appointment>
 */
export class Query extends GenericQuery<AppointmentMinimalView> {
    #appointmentStatus: AppointmentStatus | null = null;
    #date: Date | string | null = null;
    #limit: Date | string | null = null;
    #doctor: IdentifiableDoctor | null = null;
    #patient: IdentifiablePatient | null = null;

    constructor(q = "") {
        super(q);
        //super.setLocalDatabase(db);
        super.setPrefix("appointments");
    }

    filterByAppointmentStatus(status: AppointmentStatus | null) {
        this.#appointmentStatus = status;
        return this;
    }

    filterByDate(date: Date | string | null) {
        this.#date = date;
        return this;
    }

    setLimitDate(date: Date | string | null) {
        this.#limit = date;
        return this;
    }

    filterByDateBetween(start: Date | string | null, finish: Date | string | null) {
        return this.filterByDate(start).setLimitDate(finish);
    }

    filterByDoctor(doctor: IdentifiableDoctor | null) {
        if(!doctor) {
            this.#doctor = null;
            return this;
        } else if(
            (doctor.id == null || doctor.id < 1) && (doctor.file == null || doctor.file < 1)
        ) return this;
        this.#doctor = doctor;
        return this;
    }

    filterByPatient(patient: IdentifiablePatient) {
        if(!patient) {
            this.#patient = null;
            return this;
        } else if(
            (patient.id == null || patient.id < 1) && (patient.dni == null || patient.dni == "")
        ) return this;
        this.#patient = patient;
        return this;
    }

    getParams(): Record<string, any> {
        return {
            ...super.getParams(),
            appointmentStatus: this.#appointmentStatus,
            date: this.#date,
            limit: this.#limit,
            ...(this.#doctor && {
                doctorId: this.#doctor.id,
                doctorFile: this.#doctor.file,
            }),
            ...(this.#patient && {
                patientId: this.#patient.id,
                patientDni: this.#patient.dni
            })
        };
    }

}

/**
 * Actualiza un turno.
 * @param {number} id Id del turno.
 * @param {AppointmentBasicProperties} data Datos del turno.
 * @returns {Promise<IAppointment>}
 */
export const update = async (id: number, data: AppointmentBasicProps): Promise<IAppointment> => {
    return u.patch(`appointments/id/${id}`, data)
        .then(response => response.json())
        //.then(result => db.update(result))
        .catch(err => {
            throw err;
        });
};

/**
 * Elimina un turno.
 * @param {number} id Id del turno.
 * @returns {Promise<boolean>}
 */
export const disable = async (id: number): Promise<boolean> => {
    return u.del(`appointments/id/${id}`)
        .then(response => response.ok)
        .catch(err => {
            throw err;
        });
};
/**
 * Habilita logicamente un turno.
 * @param {number} id Id del turno.
 * @returns {Promise<boolean>}
 */
export const enable = async (id: number): Promise<boolean> => {
    return u.post(`appointments/id/${id}`)
        .then(response => response.ok)
        .catch(err => {
            throw err;
        });
};

/**
 * 
 * @param {number} doctorFile 
 * @param {Date} begin 
 * @returns {Promise<string[] | Date[]>}
 */
export const getAvailableDates = async (doctorFile: number, begin: Date): Promise<string[] | Date[]> => {
    return u.get(`doctors/file/${doctorFile}/datesAvailable`, { from: new Date(begin).toISOString().split("T")[0] })
        .then(response => response.json())
        .then(x => x.map((d: string | number | Date) => (new Date(d).toLocaleDateString())))
        .catch(console.error);
};

/**
 * 
 * @param {number} doctorFile 
 * @param {Date} date 
 * @returns {Promise<string[]>}
 */
export const getAvailableSchedules = async (doctorFile: number, date: Date): Promise<string[]> => {
    return u.get(`doctors/file/${doctorFile}/schedules`, {"for": new Date(date).toISOString().split("T")[0]})
        .then(response => response.json())
        .then(schedule => schedule.map((z: string[]) => z.map((zz: string) => ('0' + zz).slice(-2)).join(":")))
        .catch(console.error);
};