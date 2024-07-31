'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../ui/accordion";
import React from "react";
import {IUser, Permits} from "../../../../entity/users";
import {PermissionItem} from "./PermissionItem";

export interface PermissionsCardProps {
    user: IUser | null | undefined;
}

export const PermissionsCard = ({ user }: PermissionsCardProps) => {
    if(!user) return <></>;
    return (<Card>
        <CardHeader>
            <div className="font-semibold">Permisos</div>
        </CardHeader>
        <CardContent>
            {user.username === "root" && <div className="grid place-items-center text-sm">
                El usuario @root dispone de todos los permisos y no se le pueden ser revocados.
            </div>}
            {user.username != "root" && <div className="grid gap-3">
                <Accordion type="single" collapsible>
                    <AccordionItem value={"specialties"}>
                        <AccordionTrigger>Especialidades</AccordionTrigger>
                        <AccordionContent>
                            <PermissionItem user={user} action={Permits.CREATE_SPECIALTY} label={"Crear"}/>
                            <PermissionItem user={user} action={Permits.UPDATE_SPECIALTY} label={"Modificar"}/>
                            <PermissionItem user={user} action={Permits.READ_DISABLED_SPECIALTY_RECORDS}
                                            label={"Leer registros deshabilitados"}/>
                            <PermissionItem user={user} action={Permits.DISABLE_SPECIALTY} label={"Deshabilitar"}/>
                            <PermissionItem user={user} action={Permits.ENABLE_SPECIALTY} label={"Habilitar"}/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"patients"}>
                        <AccordionTrigger>Pacientes</AccordionTrigger>
                        <AccordionContent>
                            <PermissionItem user={user} action={Permits.CREATE_PATIENT} label={"Registrar"}/>
                            <PermissionItem user={user} action={Permits.READ_PATIENT_PERSONAL_DATA}
                                            label={"Leer datos personales"}/>
                            <PermissionItem user={user} action={Permits.READ_PATIENT_APPOINTMENTS}
                                            label={"Acceder a turnos individuales"}/>
                            <PermissionItem user={user} action={Permits.UPDATE_PATIENT} label={"Modificar"}/>
                            <PermissionItem user={user} action={Permits.DISABLE_PATIENT} label={"Deshabilitar"}/>
                            <PermissionItem user={user} action={Permits.ENABLE_PATIENT} label={"Habilitar"}/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"doctors"}>
                        <AccordionTrigger>Médicos</AccordionTrigger>
                        <AccordionContent>
                            <PermissionItem user={user} action={Permits.CREATE_DOCTOR} label={"Registrar"}/>
                            <PermissionItem user={user} action={Permits.READ_DOCTOR} label={"Leer datos personales"}/>
                            <PermissionItem user={user} action={Permits.READ_DOCTOR_APPOINTMENTS}
                                            label={"Acceder a turnos individuales"}/>
                            <PermissionItem user={user} action={Permits.UPDATE_DOCTOR_PERSONAL_DATA}
                                            label={"Modificar"}/>
                            <PermissionItem user={user} action={Permits.UPDATE_DOCTOR_SCHEDULES}
                                            label={"Actualizar horarios"}/>
                            <PermissionItem user={user} action={Permits.DISABLE_DOCTOR} label={"Deshabilitar"}/>
                            <PermissionItem user={user} action={Permits.ENABLE_DOCTOR} label={"Habilitar"}/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"appointments"}>
                        <AccordionTrigger>Turnos</AccordionTrigger>
                        <AccordionContent>
                            <PermissionItem user={user} action={Permits.CREATE_APPOINTMENT} label={"Crear"}/>
                            <PermissionItem user={user} action={Permits.READ_APPOINTMENT} label={"Leer"}/>
                            <PermissionItem user={user} action={Permits.UPDATE_APPOINTMENT} label={"Modificar"}/>
                            <PermissionItem user={user} action={Permits.DISABLE_APPOINTMENT} label={"Deshabilitar"}/>
                            <PermissionItem user={user} action={Permits.ENABLE_APPOINTMENT} label={"Habilitar"}/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"users"}>
                        <AccordionTrigger>Usuarios</AccordionTrigger>
                        <AccordionContent>
                            <PermissionItem user={user} action={Permits.GRANT_PERMISSIONS} label={"Conceder permisos"}/>
                            <PermissionItem user={user} action={Permits.ASSIGN_DOCTOR} label={"Asignar médicos"}/>
                            <PermissionItem user={user} action={Permits.RESET_PASSWORD}
                                            label={"Restablecer contraseñas"}/>
                            <PermissionItem user={user} action={Permits.UPDATE_USER_DATA}
                                            label={"Actualizar información personal"}/>
                            <PermissionItem user={user} action={Permits.DELETE_OR_ENABLE_USER}
                                            label={"Habilitar y deshabilitar"}/>
                            <PermissionItem user={user} action={Permits.READ_USER_DATA}
                                            label={"Leer datos personales"}/>
                            <PermissionItem user={user} action={Permits.READ_USER_SESSIONS}
                                            label={"Ver sesiones abiertas"}/>
                            <PermissionItem user={user} action={Permits.CLOSE_USER_SESSIONS} label={"Cerrar sesiones"}/>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>}
        </CardContent>
    </Card>);
}