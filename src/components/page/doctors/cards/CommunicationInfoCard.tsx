'use strict';
import {Doctor, DoctorUpdateRequest} from "../../../../entity/doctors";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React, {useContext, useState} from "react";
import {BasicInfoCardProps} from "./BasicInfoCard";
import {CurrentDoctorContext} from "../CurrentDoctorContext";
import {z} from "zod";
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "../../../ui/use-toast";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../../ui/form";
import {Input} from "../../../ui/input";
import {Button} from "../../../ui/button";
import {Pencil, X} from "lucide-react";
import {Spinner} from "../../../form/Spinner";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {Permits} from "../../../../entity/users";
import * as doctors from "../../../../actions/doctors";


const p = PhoneNumberUtil.getInstance();
const formSchema = z.object({
    email: z.string().email({ message: "Ingrese un correo electrónico válido. " }),
    phone: z.string().superRefine((value, ctx) => {
        try {
            const phone = p.parse(value);
            return p.isValidNumber(phone);
        } catch(err ) {
            console.log({err});
            ctx.addIssue({
                // @ts-ignore
                message: err?.message?? "Ingrese un número de teléfono válido",
                code: z.ZodIssueCode.custom
            })
        }
    }).transform(value => {
        const phone = p.parse(value);
        return p.format(phone, PhoneNumberFormat.INTERNATIONAL);
    })
});
const getUpdatedValues = (values: z.infer<typeof formSchema>, doc: Doctor): DoctorUpdateRequest | null => {
    let v: DoctorUpdateRequest = {};
    let i = 0;
    if(doc.phone !== values.phone) v = { ...v, phone: values.phone };
    else i++;
    if(doc.email !== values.email) v = { ...v, email: values.email };
    else i++;
    console.log({v});
    if(!Object.keys(v).length) return null;
    return v;
}
export const CommunicationInfoCard = ({ }: BasicInfoCardProps) => {
    const {record: e, updater } = useContext(CurrentDoctorContext);
    const record = e as Doctor;
    const {toast} = useToast();
    const { can } = useCurrentUser();
    const canEdit: boolean = can(Permits.UPDATE_DOCTOR_PERSONAL_DATA);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    if(!e || !record.active || (!record.phone && !record.email)) return <></>;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: `${(record?.phone?? "d")}`,
            email: record?.email?? ""
        }
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if(!record) return;
        //console.log(values);
        let updatedValues = getUpdatedValues(values, record);
        console.warn({updatedValues});
        if(!updatedValues) return;
        setLoading(true);
        doctors.update(record.id, { ...updatedValues })
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




    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className={"card"}>
                <CardHeader>
                    <div className="font-semibold">Información de contacto</div>
                </CardHeader>
                <CardContent>
                    {!editMode && <KeyValueList>
                        <KeyValueRow title={"Número de teléfono"}>{record.phone}</KeyValueRow>
                        <KeyValueRow title={"Correo electrónico"}>{record.email}</KeyValueRow>
                    </KeyValueList>}
                    {editMode && <div className={"flex flex-col gap-3"}>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de teléfono</FormLabel>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
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
                        (editMode && !!getUpdatedValues(form.getValues(), record))
                        && <Button type="submit" variant={"default"} disabled={loading}>
                            {loading && <Spinner className={"w-4 h-4 mr-2"}/>}
                            {loading && "Guardando"}
                            {!loading && "Guardar cambios"}
                        </Button>}
                </div>}
            </Card>
        </form>
    </Form>);
};