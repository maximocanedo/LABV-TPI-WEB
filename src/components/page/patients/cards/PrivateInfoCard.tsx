'use strict';
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React, {useContext, useState} from "react";
import {BasicInfoCardProps} from "./BasicInfoCard";
import {CurrentPatientContext} from "../CurrentPatientContext";
import {Button} from "../../../ui/button";
import {Pencil, X} from "lucide-react";
import {Spinner} from "../../../form/Spinner";
import {useToast} from "../../../ui/use-toast";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {Permits} from "../../../../entity/users";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../../ui/form";
import * as patients from "../../../../actions/patients";
import {Input} from "../../../ui/input";
import {DatePicker} from "src/components/form/DatePicker";
import {IPatientUpdateRequest, Patient} from "../../../../entity/patients";

const formSchema = z.object({
    sex: z.string().refine(x => x==='M' || x==='F', {
        message: "Ingrese un valor válido. "
    }),
    address: z.string().min(1, { message: "Ingrese una dirección válida. " }),
    localty: z.string().min(1, { message: "Ingrese una localidad válida. " }),
    province: z.string().min(1, { message: "Ingrese una provincia válida. " }),
    birth: z.date().max(((): Date => new Date())(), { message: "¿El paciente todavía no nació?" })
});
const getUpdatedValues = (doc: Patient, values: z.infer<typeof formSchema>): IPatientUpdateRequest | null => {
    let v: IPatientUpdateRequest = {};
    if(doc.address !== values.address) v.address = values.address;
    if(doc.localty !== values.localty) v.localty = values.localty;
    if(doc.birth !== values.birth) v.birth = values.birth;
    if(doc.province !== values.province) v.province = values.province;
    if(!Object.keys(v).length) return null;
    return v;
};

export const PrivateInfoCard = ({ }: BasicInfoCardProps) => {
    const e = useContext(CurrentPatientContext);
    const { updater } = e;
    const record = e.record as Patient;
    const {toast} = useToast();
    const { can } = useCurrentUser();
    const canEdit: boolean = can(Permits.UPDATE_PATIENT);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: record?.address?? "",
            localty: record?.localty?? "",
            birth: new Date(record?.birth),
            province: record?.province?? ""
        }
    });
    if(!e.record || !record.active || (!record.birth && !record.address && !record.localty)) return null;
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
    // @ts-ignore
    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className={"card"}>
                <CardHeader>
                    <div className="font-semibold">Información sensible</div>
                </CardHeader>
                <CardContent>
                    { !editMode && <KeyValueList>
                        { record.address && <KeyValueRow title={"Dirección"}>{record.address}</KeyValueRow> }
                        { record.localty && <KeyValueRow title={"Localidad"}>{record.localty}</KeyValueRow> }
                        { record.province && <KeyValueRow title={"Provincia"}>{record.province}</KeyValueRow> }
                        { record.birth && <KeyValueRow title={"Fecha de nacimiento"}>{(() => {
                            let d = new Date(record.birth);
                            d.setHours(19);
                            d.setUTCHours(20);
                            return d;
                        })().toDateString()}</KeyValueRow> }
                    </KeyValueList>}
                    {editMode && <div className={"flex flex-col gap-3"}>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
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
                            name="localty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Localidad</FormLabel>
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
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Provincia</FormLabel>
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
                            name="birth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    <FormControl>
                                        <DatePicker disabled={loading} value={field.value} onChange={field.onChange} />
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
                        (editMode && true ) // !!getUpdatedValues(form.getValues(), record)
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