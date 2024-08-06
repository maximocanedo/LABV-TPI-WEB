'use strict';

import {FilterStatus} from "./commons";
import {weekday} from "../entity/doctors";

export interface DoctorQueryCleaned {
    q: string;
    status?: FilterStatus | null;
    day?: weekday | null;
    unassigned?: boolean;
    specialty?: number | null;
}

const filterQueryToFilterStatus = (str: string): FilterStatus | null => {
    switch(str) {
        case "all":
            return FilterStatus.BOTH;
        case "active":
            return FilterStatus.ONLY_ACTIVE;
        case "inactive":
            return FilterStatus.ONLY_INACTIVE;
        default:
            return null;
    }
}

const strToDay = (x: string): weekday | null => {
    if(['lun', 'lunes', 'monday', 'mon'].some(day => day === x.toLocaleLowerCase())) return 'MONDAY';
    if(['mar', 'martes', 'tuesday', 'tue'].some(day => day === x.toLocaleLowerCase())) return 'TUESDAY';
    if(['mie', 'mié', 'miercoles', 'miércoles', 'wednesday', 'wed'].some(day => day === x.toLocaleLowerCase())) return 'WEDNESDAY';
    if(['jue', 'jueves', 'thursday', 'thu'].some(day => day === x.toLocaleLowerCase())) return 'THURSDAY';
    if(['vie', 'viernes', 'friday', 'fri'].some(day => day === x.toLocaleLowerCase())) return 'FRIDAY';
    if(['sab', 'sáb', 'sabado', 'sábado', 'saturday', 'sat'].some(day => day === x.toLocaleLowerCase())) return 'SATURDAY';
    if(['dom', 'domingo', 'sunday', 'sun'].some(day => day === x.toLocaleLowerCase())) return 'SUNDAY';
    return null;
};

export const clearDoctorQuery = (q: string): DoctorQueryCleaned => {
    let clearQuery: string = "";
    let finalObj: DoctorQueryCleaned = { q };

    // Status:
    const statusRegex = /\bst:(\w+)/g; // st:inactive, st:active, st:all
    const foo = ([...q.matchAll(statusRegex)][0]??[])[1];
    const status: FilterStatus | null = !foo ? null : filterQueryToFilterStatus(foo);
    if(status) finalObj = { ...finalObj, status };
    q = q.replace(/\bst:\w+\s?/g, "");
    // End of status.
    // Week day:
    const dayRegex: RegExp = /\bday:(\w+)/g; // day:[monday, tuesday, ...]|[m, t, ...]|[lun, mar, ...]
    const dayStr: string = ([...q.matchAll(dayRegex)][0]??[])[1];
    const day: weekday | null = !dayStr ? null : strToDay(dayStr);
    if(day) finalObj = { ...finalObj, day };
    q = q.replace(/\bday:\w+\s?/g, "");
    // End of week day.
    // Check unassigned.
    if(q.split(" ").some(word => word === "-unassigned")) {
        finalObj = { ...finalObj, unassigned: true };
        q = q.replace("-unassigned", "");
    }

    q = q.trim();
    return { ...finalObj, q };
};