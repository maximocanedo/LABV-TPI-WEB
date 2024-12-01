'use strict';
import {ReactNode} from "react";
import {resolveLocalUrl} from "../../auth";
import {IPatient, PatientCommunicationView} from "../../entity/patients";
import {dni} from "./PatientListItem";
import {LocalContextMenu} from "../commons/LocalContextMenu";
import {MenuOption} from "../commons/menu.interfaces";

export interface LocalContextMenuProps {
    children: ReactNode;
    items: MenuOption[];
}
const tp = (phone: string): string => {
    return phone.replaceAll("-","").replaceAll(" ","");
};



export const PatientContextMenuOptions = (
    record: IPatient | PatientCommunicationView
): MenuOption[] => ([
    {
        label: "Ver perfil",
        nav: `/patients/${record.id}`
    },
    {
        label: "Copiar",
        submenu: [
            {
                label: "Enlace al perfil",
                copy: (resolveLocalUrl('/patients/' + record.id))
            },
            {
                label: "Número de D.N.I.",
                copy: dni(record.dni)
            },
            {
                label: "Dirección de correo electrónico",
                copy: (record as PatientCommunicationView).email,
                condition: "email" in record
            },
            {
                label: "Número de teléfono",
                copy: (record as PatientCommunicationView).phone,
                condition: "phone" in record
            }
        ]
    },
    {
        label: "Enviar un correo",
        condition: "email" in record,
        handler: () => {
            window.open(`mailto:${(record as PatientCommunicationView).email}`, "_blank")
        }
    },
    {
        label: "Llamar",
        condition: "phone" in record,
        handler: () => {
            window.open(`tel:${tp((record as PatientCommunicationView).phone?? "")}`, "_blank")
        }
    },
    {
        label: "Abrir en WhatsApp",
        url: `https://wa.me/${tp((record as PatientCommunicationView).phone)}`,
        condition: "phone" in record && record.phone !== undefined
    }
]);


export const LocalPatientContextMenu = ({ children, patient }: {children: ReactNode, patient: IPatient | PatientCommunicationView}) => {
    return <LocalContextMenu items={PatientContextMenuOptions(patient)}>{ children }</LocalContextMenu>
};