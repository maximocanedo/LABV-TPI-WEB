'use strict';
import {MenuOption} from "../commons/menu.interfaces";
import {DoctorMinimalView, IDoctor} from "../../entity/doctors";
import {ReactNode} from "react";
import {LocalContextMenu} from "../commons/LocalContextMenu";

export const DoctorContextMenuOptions = (
    record: IDoctor | DoctorMinimalView
): MenuOption[] => ([
    {
        label: "Ver registro",
        nav: `/doctors/${record.file}`
    },
    {
        label: "Ver cuenta de usuario",
        nav: `/users/${record.assignedUser?.username??""}`,
        condition: "assignedUser" in record && record.assignedUser != null && record.assignedUser?.username !== undefined
    },
    {
        label: "Ver especialidad",
        nav: `/specialties/${record.specialty.id}`
    },
    {
        label: "Copiar",
        submenu: [
            {
                label: "Número de legajo",
                copy: record.file.toString()
            },
            {
                label: "Nombre completo",
                copy: `${record.surname}, ${record.name}`
            }
        ]
    }
]);


export const LocalDoctorContextMenu = ({ children, record }: {children: ReactNode, record: IDoctor | DoctorMinimalView}) => {
    return <LocalContextMenu items={DoctorContextMenuOptions(record)}>{ children }</LocalContextMenu>
};