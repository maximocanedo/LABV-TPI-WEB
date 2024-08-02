'use strict';
import { getAccessToken, getRefreshToken, updateSessionToken } from './security';
import { emitAPIException, emitConnectionFailure } from './events';
import {CommonException} from "./entity/commons";

/**
 * Base de todas las URLs de las peticiones hechas con los métodos de este módulo.
 */
export const BASE_URL = "http://localhost:81/TP4_GRUPO3/";
export const WEB_PREFIX = "web";
/**
 * Métodos HTTP.
 */
export const HTTP_METHOD = Object.freeze({
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
    OPTIONS: "OPTIONS",
    HEAD: "HEAD"
});
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE';

/**
 * Resuelve una URL para ser usada en una consulta.
 * @param {string} relativeUrl URL relativa.
 * @returns La URL resuelta.
 */
export const resolveUrl = (relativeUrl: string): string => BASE_URL + relativeUrl;

export const resolveLocalUrl = (relativeUrl: string): string => {
    const normalizedRelativeUrl: string = relativeUrl.startsWith('/') ? relativeUrl : "/" + relativeUrl;
    if(window.location.port === '' || window.location.port == '80') {
        return normalizedRelativeUrl;
    }
    return `/${WEB_PREFIX}${normalizedRelativeUrl}`;
};

const resolveBody = (body: string | string[][] | Record<string, any>): string => {
    if(body == null || body == "") return "";
    return JSON.stringify(body);
};


export const resolveURLParams = (url: string, params?: string | URLSearchParams | string[][] | Record<string, string>): string => {
    const urlObj: URL = new URL(url, BASE_URL);
    const searchParams: URLSearchParams = new URLSearchParams(params);
    urlObj.search = searchParams.toString();
    return urlObj.toString();
};


/**
 * Realiza una petición a la API.
 * @param {string} url URL relativa a la {@link BASE_URL URL Base}.
 * @param {string} method Método HTTP.
 * @param {object} body Cuerpo de la petición.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
const req = async (url: string, method: HttpMethod, body: string | Record<string, any> | any): Promise<Response> => {
    const makeRequest = async (token: string | null): Promise<Response> => {
            const response: Response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token?? ""
                },
                ...(method === "GET" || method === "HEAD" ? {} : { body: resolveBody(body) })
            });

            if (response.headers.has("Authorization")) {
                updateSessionToken(response.headers.get("Authorization"));
            }

            return response;
    };



    try {
        const accessToken: string = getAccessToken()?? "";
        const firstTry: Response = await makeRequest(accessToken);
        if (firstTry.status === 498) {
            console.debug("Autenticando con token de refresco.");
            const refreshToken: string = getRefreshToken()??"";
            return await makeRequest(refreshToken);
        }
        if (!firstTry.ok) {
            const err = (await firstTry.json());
            emitAPIException(err.error);
            throw err.error;
        }
        return firstTry;
    } catch (error: any) {
        if(error.name == "TypeError" && error.message == 'Failed to fetch')
            emitConnectionFailure(url, method, body, error);
        if('path' in error)
            emitAPIException(error);
        throw error; 
    }
};

/**
 * Realiza una petición de tipo GET a la API.
 * @param {String} relativeUrl URL relativa a la {@link BASE_URL URL Base}
 * @param {Object} params Objeto con los parámetros en línea, de ser necesarios.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
export const get = async (relativeUrl: string, params: Record<string, any> = {}): Promise<Response> => await req(resolveURLParams(relativeUrl, params), HTTP_METHOD.GET, "");

/**
 * Realiza una petición de tipo HEAD a la API.
 * @param {String} relativeUrl URL relativa a la {@link BASE_URL URL Base}
 * @param {Object} params Objeto con los parámetros en línea, de ser necesarios.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
export const head = async (relativeUrl: string, params: Record<string, any> = {}): Promise<Response> => await req(resolveURLParams(relativeUrl, params), HTTP_METHOD.HEAD, "");

/**
 * Realiza una petición de tipo POST a la API.
 * @param {String} relativeUrl URL relativa a la {@link BASE_URL URL Base}
 * @param {any} body Objeto parseable a JSON, con los parámetros.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
export const post = async (relativeUrl: string, body: string | Record<string, any> = {}): Promise<Response> => await req(resolveUrl(relativeUrl), HTTP_METHOD.POST, body);

/**
 * Realiza una petición de tipo PATCH a la API.
 * @param {String} relativeUrl URL relativa a la {@link BASE_URL URL Base}
 * @param {any} body Objeto parseable a JSON, con los parámetros.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
export const patch = async (relativeUrl: string, body: string | Record<string, any> = {}): Promise<Response> => await req(resolveUrl(relativeUrl), HTTP_METHOD.PATCH, body);

/**
 * Realiza una petición de tipo PUT a la API.
 * @param {String} relativeUrl URL relativa a la {@link BASE_URL URL Base}
 * @param {any} body Objeto parseable a JSON, con los parámetros.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
export const put = async (relativeUrl: string, body: string | Record<string, any> = {}): Promise<Response> => await req(resolveUrl(relativeUrl), HTTP_METHOD.PUT, body);

/**
 * Realiza una petición de tipo DELETE a la API.
 * @param {String} relativeUrl URL relativa a la {@link BASE_URL URL Base}
 * @param {any} body Objeto parseable a JSON, con los parámetros.
 * @returns {Promise<Response>} Respuesta del servidor.
 */
export const del = async (relativeUrl: string, body: string | Record<string, any> = ""): Promise<Response> => await req(resolveUrl(relativeUrl), HTTP_METHOD.DELETE, body);
