'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React, {useContext, useState} from "react";
import {Button} from "../../../ui/button";
import {CalendarCheck, X} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../../ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import * as appointments from "../../../../actions/appointments";
import {useToast} from "../../../ui/use-toast";
import {Spinner} from "../../../form/Spinner";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {Permits} from "../../../../entity/users";
import {CurrentAppointmentContext} from "../CurrentAppointmentContext";
import {Textarea} from "../../../ui/textarea";

export interface CloseCardProps { }

const formSchema = z.object({
    remarks: z.string()
});


export const CloseCard = ({ }: CloseCardProps) => {
    const {record, updater} = useContext(CurrentAppointmentContext);
    const { me, can } = useCurrentUser();
    const canEdit: boolean = can(Permits.UPDATE_APPOINTMENT);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            remarks: record?.remarks?? ""
        },
    });
    const {toast} = useToast();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if(!record) return;
        setLoading(true);
        //console.log(values);
        appointments.update(record.id, { remarks: values.remarks, status: "PRESENT" })
            .then(updated => {
                updater(updated);
                toast({
                    variant: "default",
                    description: "Cerraste el turno correctamente. "
                });
                setEditMode(false);
            }).catch(err => {
                toast({
                    variant: "destructive",
                    title: err.message?? "Algo salió mal. ",
                    description: err.description?? "Hubo un error desconocido al intentar cerrar el turno. "
                });
            }).finally(() => {
                setLoading(false);
            }); //*/
    };



    if(!record || !record.id || record.status != "PENDING" || new Date().valueOf() < new Date(record.date).valueOf()) return null;
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className={"card"}>
            <CardHeader>
                <div className="font-semibold">Cerrar turno</div>
            </CardHeader>
            <CardContent>
                { !editMode && <p>Usá esta opción sólo si el paciente se presentó al turno.</p> }
                { editMode && <div className={"flex flex-col gap-3"}>
                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                    <Textarea {...field} disabled={loading} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>}
            </CardContent>
                {canEdit && <div className={"flex flex-row justify-end p-3 gap-3 pt-0"}>
                    <Button disabled={loading} type={"button"} variant={"ghost"} onClick={() => setEditMode(!editMode)}>
                        {editMode && <><X className={"pr-2"}/>Cancelar</>}
                        {!editMode && <><CalendarCheck className={"pr-2"}/>Cerrar</>}</Button>
                    {
                        (editMode)
                        && <Button type="submit" variant={"default"} disabled={loading}>
                            {loading && <Spinner className={"w-4 h-4 mr-2"}/>}
                            {loading && "Guardando"}
                            {!loading && "Listo"}
                        </Button>}
                </div>}
            </Card>

        </form>
    </Form>;
};

