'use strict';

import {Search} from "lucide-react";
import {Input} from "../ui/input";
import React, {useState} from "react";
import {FilterStatus} from "../../actions/commons";
import {AppointmentQueryCleaned, clearDoctorQuery} from "../../actions/query.utils";

export interface AppointmentCommandQueryProps {
    q?: string;
    onSearch: (obj: AppointmentQueryCleaned) => void;
    className?: string;
}

const fs = (str: string): FilterStatus | null => {
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
// @ts-ignore
// @ts-ignore
export const AppointmentCommandQuery = ({q: leg, onSearch }: AppointmentCommandQueryProps) => {

    // Búsqueda y filtros
    const [q, setQ] = useState<string>(leg??"");
    const [finalQuery, setFinalQuery] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus | null>(null);


    const s = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(clearDoctorQuery(q));
    };

    return (<form action={"#"} onSubmit={s}>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    onChange={x => setQ(x.target.value)}
                    value={q}
                    placeholder="Buscar turnos"
                    className="w-full appearance-none bg-background pl-8 shadow-none w-full"
                />
            </div>
        </form>
    );
};