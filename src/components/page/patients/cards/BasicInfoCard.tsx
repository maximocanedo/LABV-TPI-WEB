'use strict';

import {DoctorUpdateRequest, IDoctor} from "src/entity/doctors";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React, {useContext, useState} from "react";
import {SpecialtyLink} from "../../../dialog-selectors/specialty/SpecialtyLink";
import {Button} from "../../../ui/button";
import {Pencil, X} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../../ui/form";
import {Input} from "../../../ui/input";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import * as patients from "../../../../actions/patients";
import {useToast} from "../../../ui/use-toast";
import {Spinner} from "../../../form/Spinner";
import {SpecialtyButtonSelector} from "../../../dialog-selectors/specialty/SpecialtyButtonSelector";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {Permits} from "../../../../entity/users";
import {CurrentPatientContext} from "../CurrentPatientContext";
import {IPatient, IPatientUpdateRequest} from "../../../../entity/patients";

export interface BasicInfoCardProps { }

const formSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre no puede estar vacío. "
    }),
    surname: z.string().min(1, {
        message: "El apellido no puede estar vacío. "
    })
});


const getUpdatedValues = (doc: IPatient, values: z.infer<typeof formSchema>): IPatientUpdateRequest | null => {
    let v: DoctorUpdateRequest = {};
    let i = 0;
    if(doc.name !== values.name) v = { ...v, name: values.name };
    else i++;
    if(doc.surname !== values.surname) v = { ...v, surname: values.surname };
    else i++;
    if(i === 2) return null;
    else return v;
}

export const BasicInfoCard = ({ }: BasicInfoCardProps) => {
    const {record, updater} = useContext(CurrentPatientContext);
    const { me, can } = useCurrentUser();
    const canEdit: boolean = can(Permits.UPDATE_PATIENT);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: record?.name?? "",
            surname: record?.surname?? ""
        },
    });
    const {toast} = useToast();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if(!record) return;
        setLoading(true);
        //console.log(values);
        let updatedValues = getUpdatedValues(record, values);
        if(!updatedValues) return;
        patients.update(record.id, { ...updatedValues })
            .then(updated => {
                updater(updated);
                toast({
                    variant: "default",
                    description: "Se guardaron los cambios correctamente. "
                });
                setEditMode(false);
            }).catch(err => {
                console.warn({errWhileUpdatingDoctor: err});
                toast({
                    variant: "destructive",
                    title: err.message?? "Algo salió mal. ",
                    description: err.description?? "Hubo un error desconocido al intentar guardar los cambios. "
                });
            }).finally(() => {
                setLoading(false);
            }); //*/
    };



    if(!record || !record.id) return null;
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className={"card"}>
            <CardHeader>
                <div className="font-semibold">Información básica</div>
            </CardHeader>
            <CardContent>
                { !editMode && <KeyValueList>
                    <KeyValueRow title={"ID N.º"}>{record.id}</KeyValueRow>
                    <KeyValueRow title={"Nombre"}>{record.name}</KeyValueRow>
                    <KeyValueRow title={"Apellido"}>{record.surname}</KeyValueRow>
                    <KeyValueRow title={"D.N.I. N.º"}>{record.dni}</KeyValueRow>
                    <KeyValueRow title={"Estado"}>{record.active ? "Habilitado" : "Deshabilitado"}</KeyValueRow>
                </KeyValueList> }
                { editMode && <div className={"flex flex-col gap-3"}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={loading} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={loading} />
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
                        {!editMode && <><Pencil className={"pr-2"}/>Editar</>}</Button>
                    {
                        (editMode && !!getUpdatedValues(record, form.getValues()))
                        && <Button type="submit" variant={"default"} disabled={loading}>
                            {loading && <Spinner className={"w-4 h-4 mr-2"}/>}
                            {loading && "Guardando"}
                            {!loading && "Guardar cambios"}
                        </Button>}
                </div>}
            </Card>

        </form>
    </Form>;
};

