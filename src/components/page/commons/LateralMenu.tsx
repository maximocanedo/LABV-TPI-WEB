'use strict';

import {TabLink} from "../../buttons/TabLink";
import {CalendarDays, ChartColumn, Home, NotebookTabs, Stethoscope, Users} from "lucide-react";
import React, {useEffect, useState} from "react";
import {resolveLocalUrl, WEB_PREFIX} from "../../../auth";
import {useLocation} from "react-router";

export interface LateralMenuProps {
    isInModal: boolean;
}

export const LateralMenu = (props: LateralMenuProps) => {

    const location = useLocation();

    const cur = (base: string): boolean => location.pathname.startsWith(`/${WEB_PREFIX}/${base}`)
                        || location.pathname.startsWith(`/${base}`);
    const c: string = props.isInModal ? "grid gap-2 text-lg font-medium": "grid items-start px-2 text-sm font-medium lg:px-4";

    const [home, setHome] = useState<boolean>(cur("home"));
    const [appointments, setAppointments] = useState<boolean>(cur("appointments"));
    const [doctors, setDoctors] = useState<boolean>(cur("doctors"));
    const [patients, setPatients] = useState<boolean>(cur("patients"));
    const [users, setUsers] = useState<boolean>(cur("users"));
    const [reports, setReports] = useState<boolean>(cur("reports"));


    const updateState = () => {
        setAppointments(cur("appointments"));
        setDoctors(cur("doctors"));
        setPatients(cur("patients"));
        setUsers(cur("users"));
        setReports(cur("reports"));
        setHome(location.pathname == "/");
    };

    useEffect(() => {
        updateState();
    }, [location.pathname]);

    return (<nav className={c}>
            <TabLink href={resolveLocalUrl("/")} active={home}><Home className="h-4 w-4"/>Inicio</TabLink>
            <TabLink href={resolveLocalUrl("/appointments")} active={appointments}><CalendarDays className="h-4 w-4"/>Turnos</TabLink>
            <TabLink href={resolveLocalUrl("/doctors")} active={doctors}><Stethoscope className="h-4 w-4"/>Médicos</TabLink>
            <TabLink href={resolveLocalUrl("/patients")} active={patients}><NotebookTabs className="h-4 w-4"/>Pacientes</TabLink>
            <TabLink href={resolveLocalUrl("/users")} active={users}><Users className="h-4 w-4"/>Usuarios</TabLink>
            <TabLink href={resolveLocalUrl("/reports")} active={reports}><ChartColumn className="h-4 w-4"/>Reportes</TabLink>
        </nav>);
};