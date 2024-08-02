'use strict';
/// <reference path="./types/entities" />

import {HttpMethod} from "./auth";
import {CommonException} from "./entity/commons";
import {IUser} from "./entity/users";

export class APIExceptionEvent extends CustomEvent<CommonException> {
    static EVENT_NAME = "onAPIException";
    constructor(err: CommonException) {
        super(APIExceptionEvent.EVENT_NAME, { detail: { ...err } });
    }
}

export class ConnectionFailureEvent extends CustomEvent<{url: string, method: HttpMethod, body: any, error: TypeError}> {
    static EVENT_NAME: string = "onConnectionFailure";
    constructor(url: string, method: HttpMethod, body: any, error: TypeError) {
        super(ConnectionFailureEvent.EVENT_NAME, { detail: { url, method, body, error } });
    }
}

export class CurrentUserLoadedEvent extends CustomEvent<{user: IUser}> {
    static EVENT_NAME = "onCurrentUserLoaded";
    constructor(user: IUser) {
        super(CurrentUserLoadedEvent.EVENT_NAME, { detail: { user } });
    }
};

/**
 * El evento onConnectionFailure se lanza cuando una solicitud HTTP no 
 * puede realizarse correctamente por problemas de conexión.
 * @param {String} url URL de la solicitud.
 * @param {string} method Método HTTP de la solicitud.
 * @param {JSON} body Cuerpo de la solicitud.
 * @param {TypeError} error Excepción obtenida.
 */
export const emitConnectionFailure = (url: string, method: HttpMethod, body: any, error: TypeError): void => {
    const event: ConnectionFailureEvent = new ConnectionFailureEvent(url, method, body, error);
    console.log(event);
    document.dispatchEvent(event);
};

/**
 * El evento onAPIException se lanza cuando el servidor responde con un error controlado.
 * @param {CommonException} error Error devuelto por el servidor.
 */
export const emitAPIException = (error: CommonException): void => {
    const event: APIExceptionEvent = new APIExceptionEvent(error);
    console.log(event);
    document.dispatchEvent(event);
};