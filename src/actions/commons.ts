'use strict';
import * as u from '../auth';

const q = <T extends Element>(s: string) => document.querySelector<T>(s);

export const button = (selector: string) => q<HTMLButtonElement>(selector);
export const div = (selector: string) => q<HTMLDivElement>(selector);
export const input = (selector: string) => q<HTMLInputElement>(selector);
export const textarea = (selector: string) => q<HTMLTextAreaElement>(selector);
export const select = (selector: string) => q<HTMLSelectElement>(selector);
export const a = (selector: string) => q<HTMLAnchorElement>(selector);

export const banner = (text: string): HTMLDivElement => {
    const b: HTMLDivElement = document.createElement("div");
    b.classList.add("alert", "alert-danger", "mt-3", "mb-3");
    b.innerText = text;
    return b;
};

export const placeFileErrorBanner = (text: string): void => {
    const b: HTMLDivElement = banner(text);
    const el: Element | null = document.querySelector("#nav-tabContent");
    if(el == null) return;
    el.innerHTML = '';
    el.append(b);
};

export const treatAPIErrors = (err: any): void => {
    if('error' in err && 'path' in err.error) {
        placeFileErrorBanner(err.error.message + ': ' + err.error.description + '\n\n' + err.error.path);
    } else placeFileErrorBanner('Error desconocido. ');
}

export const toastAPIErrors = (err: any): void => {
    if('error' in err && 'path' in err.error) {
        console.warn( "Toaster should be showing. ", {id: err.error.path}, err.error.message + ': ' + err.error.description);
    } else console.warn("Toaster should be showing. ",{ id: "unknown-error"}, 'Error desconocido. ');
}

export enum FilterStatus {
    ONLY_ACTIVE = "ONLY_ACTIVE",
    ONLY_INACTIVE = "ONLY_INACTIVE",
    BOTH = "BOTH"
}

/**
 * Clase para construir y ejecutar consultas de búsqueda de registros.
 * @template T Entidad.
 * @example 
 * // Búsqueda simple:
 * const list: Promise<T[]> = await new Query("Algo").search();
 * 
 * @example
 * // Búsqueda con filtros:
 * const query: Query = new Query("Algo");
 * query
 *   .filterByStatus(FilterStatus.ONLY_ACTIVE)
 *   .filterByDay("MONDAY")
 *   .filterBySpecialty(1)
 *   .paginate(2, 5);
 * const list: Promise<T[]> = await query.search();
 */
export class GenericQuery<T> {
    #q;
    #status: string = "";
    #page: number = 1;
    #size: number = 10;
    #localDatabase = null; // Reimplementar luego.
    #APIPrefix: string = "commons";

    /**
     * Crea una nueva instancia de Query.
     * @param {string} q Texto de búsqueda.
     */
    constructor(q?: string | null) {
        this.#q = q?? "";
    }

    setQueryText(q?: string | null) {
        this.#q = q?? "";
        return this;
    }

    setLocalDatabase(localDatabase: any) {
        this.#localDatabase = localDatabase;
        return this;
    }

    setPrefix(prefix: string = "commons") {
        this.#APIPrefix = prefix;
        return this;
    }

    fromSelector: boolean = false;
    isSelector(s: boolean = false) {
        this.fromSelector = s;
        return this;
    }


    getParams(): Record<string, any> {
        return {
            q: this.#q,
            status: this.#status,
            page: this.#page,
            size: this.#size,
            fromSelector: this.fromSelector
        };
    }

    #getCleanedParams() {
        const params: Record<string, any> = this.getParams();
        const keys: string[] = Object.keys(params);
        let newParams: Record<string, string> = {};
        keys.forEach((key: string): void => {
            if(params[key] != undefined && params[key] != null) newParams[key] = params[key] + "";
        });
        return newParams;
    }

    /**
     * Ejecuta la búsqueda de registros según los parámetros configurados.
     * @returns {Promise<T[]>} Promesa con un array de registros encontrados.
     */
    async search(): Promise<T[]> {
        const params: Record<string, string> = this.#getCleanedParams();
        return u.get(this.#APIPrefix, params)
            .then((response: Response): Promise<T[]> => response.json())
            /*.then(results => {
                const updatePromises = results.map(result => this.#localDatabase.update(result));
                return Promise.all(updatePromises);
            }) */
            .catch(err => {
                throw err;
            });
    }

    async next(): Promise<T[]> {
        this.paginate(this.#page + 1, this.#size);
        return this.search();
    }

    async prev(): Promise<T[]> {
        this.paginate((this.#page == 1 ? 1 : this.#page - 1), this.#size);
        return this.search();
    }

    /**
     * Configura la paginación para la búsqueda.
     * @param {number} page Número de página.
     * @param {number} size Tamaño de la página.
     * @returns {GenericQuery} Instancia actual de GenericQuery.
     */
    paginate(page: number, size: number) {
        if (page != null && page > 0) this.#page = page;
        if (size != null && size > 0) this.#size = size;
        return this;
    }

    /**
     * Filtra los registros por estado.
     * @param {string} status Estado por el cual filtrar.
     * @returns {GenericQuery} Instancia actual de GenericQuery.
     */
    filterByStatus(status: FilterStatus) {
        this.#status = status;
        return this;
    }
};