'use strict';
import {ReactNode} from "react";
import {AppointmentMinimalView, IAppointment} from "../../../entity/appointments";
import {LocalContextMenu} from "../../commons/LocalContextMenu";
import {MenuOption} from "../../commons/menu.interfaces";

export interface LocalContextMenuProps {
    children: ReactNode;
    items: MenuOption[];
}
const tp = (phone: string): string => {
    return !phone ? "" : phone.replaceAll("-","").replaceAll(" ","");
};



export const AppointmentContextMenuOptions = (
    record: IAppointment | AppointmentMinimalView
): MenuOption[] => ([
    {
        label: "Ver turno",
        nav: `/appointments/${record.id}`
    },{
        label: "Ver perfil del paciente",
        nav: `/patients/${record.patient.id}`
    },{
        label: "Ver perfil del médico",
        nav: `/doctors/${record.assignedDoctor.file}`
    }
]);


export const LocalAppointmentContextMenu = ({ children, patient }: {children: ReactNode, patient: IAppointment | AppointmentMinimalView }) => {
    return <LocalContextMenu items={AppointmentContextMenuOptions(patient)}>{ children }</LocalContextMenu>
};