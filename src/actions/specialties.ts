'use strict';
import * as u from '../auth';
import { GenericQuery } from './commons';
import {Specialty, SpecialtyProps} from "../entity/specialties";

/**
 * Registra una especialidad.
 * @param {SpecialtyProps} data 
 * @returns {Promise<Specialty>}
 */
export const create = async (data: SpecialtyProps): Promise<Specialty> => {
    return u.post("specialties", data)
        .then(response => response.json())
        .catch(err => {
            throw err;
        })
};

/**
 * @class
 * @extends GenericQuery<Specialty>
 */
export class Query extends GenericQuery<Specialty> {
    constructor(q: string = "") {
        super(q);
        super.setLocalDatabase(null);
        super.setPrefix("specialties");
    }
}

/**
 * Buscar por ID.
 * @param {number} id 
 * @returns {Promise<Specialty>}
 */
export const findById = async (id: number): Promise<Specialty> => {
    return u.get("specialties/" + id)
        .then(response => response.json())
        //.then(result => db.update(result))
        .catch(err => {
            throw err;
        });
};

/**
 * Actualizar datos de una especialidad.
 * @param {number} id 
 * @param {SpecialtyProps} data 
 * @returns {Promise<Specialty>}
 */
export const update = async (id: number, data: SpecialtyProps): Promise<Specialty> => {
    return u.patch("specialties/" + id, data)
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
    return u.del("specialties/" + id)
        .then(response => response.ok)
        .then(ok => {
            // TODO: Eliminar de la db local.
            return ok;
        })
        .catch(err => {
            throw err;
        });
};

/**
 * Habilita un elemento.
 * @param {number} id 
 */
export const enable = async (id: number): Promise<boolean> => {
    return u.post("specialties/" + id)
        .then(response => response.ok)
        .catch(err => {
            throw err;
        });
};