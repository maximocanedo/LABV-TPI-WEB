'use strict';

import {DoctorUpdateRequest, IDoctor} from "src/entity/doctors";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React, {useContext, useState} from "react";
import {Button} from "../../../ui/button";
import {CalendarCheck, OctagonX, Pencil, X} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../../ui/form";
import {Input} from "../../../ui/input";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import * as appointments from "../../../../actions/appointments";
import {useToast} from "../../../ui/use-toast";
import {Spinner} from "../../../form/Spinner";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {Permits} from "../../../../entity/users";
import {IPatient, IPatientUpdateRequest} from "../../../../entity/patients";
import {CurrentPatientContext} from "../../patients/CurrentPatientContext";
import {CurrentAppointmentContext} from "../CurrentAppointmentContext";
import {Textarea} from "../../../ui/textarea";

export interface CancelledCardProps { }


export const CancelledCard = ({ }: CancelledCardProps) => {
    const {record, updater} = useContext(CurrentAppointmentContext);
    const { me, can } = useCurrentUser();
    const canEdit: boolean = can(Permits.UPDATE_APPOINTMENT) ||
        (!!record && me != null && me != "loading" && me.doctor?.file == record.assignedDoctor.file);
    const {toast} = useToast();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const onSubmit = () => {
        if(!record) return;
        setLoading(true);
        //console.log(values);
        appointments.update(record.id, { remarks: "", status: "CANCELLED" })
            .then(updated => {
                updater(updated);
                toast({
                    variant: "default",
                    description: "Cancelaste el turno correctamente. "
                });
                setEditMode(false);
            }).catch(err => {
                toast({
                    variant: "destructive",
                    title: err.message?? "Algo salió mal. ",
                    description: err.description?? "Hubo un error desconocido al intentar cancelar el turno. "
                });
            }).finally(() => {
                setLoading(false);
            }); //*/
    };



    if(!record || !record.id || record.status != "PENDING" || (new Date().valueOf() > new Date(record.date).valueOf())) return null;
    return <Card className={"card"}>
            <CardHeader>
                <div className="font-semibold">Cancelar turno</div>
            </CardHeader>
            <CardContent>
                {!editMode && <p>Podés cancelar el turno antes de que comience. </p>}
                { editMode && <p>
                    ¿Estás seguro?
                </p>}
            </CardContent>
                {canEdit && <div className={"flex flex-row justify-end p-3 gap-3 pt-0"}>
                    <Button disabled={loading} type={"button"} variant={"ghost"} onClick={() => setEditMode(!editMode)}>
                        {editMode && <><X className={"pr-2"}/>Cancelar</>}
                        {!editMode && <><OctagonX className={"pr-2"}/>Cancelar turno</>}</Button>
                    {
                        (editMode)
                        && <Button onClick={onSubmit} variant={"destructive"} disabled={loading}>
                            {loading && <Spinner className={"w-4 h-4 mr-2"}/>}
                            {loading && "Guardando"}
                            {!loading && "Cancelar turno"}
                        </Button>}
                </div>}
            </Card>;
};
