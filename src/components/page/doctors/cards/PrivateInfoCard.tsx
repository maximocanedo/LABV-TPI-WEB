'use strict';
import {Doctor, DoctorUpdateRequest} from "../../../../entity/doctors";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React, {useContext, useState} from "react";
import {BasicInfoCardProps} from "./BasicInfoCard";
import {CurrentDoctorContext} from "../CurrentDoctorContext";
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
import * as doctors from "../../../../actions/doctors";
import {sex} from "../../../../entity/commons";
import {Input} from "../../../ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../ui/select";
import { Popover } from "src/components/ui/popover";
import { DatePicker } from "src/components/form/DatePicker";

const formSchema = z.object({
    sex: z.string().refine(x => x==='M' || x==='F', {
        message: "Ingrese un valor válido. "
    }),
    address: z.string().min(1, { message: "Ingrese una dirección válida. " }),
    localty: z.string().min(1, { message: "Ingrese una localidad válida. " }),
    birth: z.date().max((() => {
        let d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    })(), { message: "El médico debe tener al menos 18 años. " })
});
const getUpdatedValues = (doc: Doctor, values: z.infer<typeof formSchema>): DoctorUpdateRequest | null => {
    let v: DoctorUpdateRequest = {};
    if(doc.sex !== values.sex) v.sex = values.sex as sex;
    if(doc.address !== values.address) v.address = values.address;
    if(doc.localty !== values.localty) v.localty = values.localty;
    if(doc.birth !== values.birth) v.birth = values.birth;
    if(!Object.keys(v).length) return null;
    return v;
};

export const PrivateInfoCard = ({ }: BasicInfoCardProps) => {
    const e = useContext(CurrentDoctorContext);
    const { updater } = e;
    const record = e.record as Doctor;
    const {toast} = useToast();
    const { can } = useCurrentUser();
    const canEdit: boolean = can(Permits.UPDATE_DOCTOR_PERSONAL_DATA);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    if(!e.record || !record.active || (!record.birth && !record.address && !record.sex && !record.localty)) return null;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sex: record?.sex?? "M",
            address: record?.address?? "",
            localty: record?.localty?? "",
            birth: new Date(record?.birth)
        }
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if(!record) return;
        setLoading(true);
        //console.log(values);
        let updatedValues = getUpdatedValues(record, values);
        if(!updatedValues) return;
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
    // @ts-ignore
    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className={"card"}>
                <CardHeader>
                    <div className="font-semibold">Información sensible</div>
                </CardHeader>
                <CardContent>
                    { !editMode && <KeyValueList>
                        { record.sex && <KeyValueRow title={"Sexo"}>{{"M": "Masculino", "F": "Femenino"}[record.sex]}</KeyValueRow> }
                        { record.address && <KeyValueRow title={"Dirección"}>{record.address}</KeyValueRow> }
                        { record.localty && <KeyValueRow title={"Localidad"}>{record.localty}</KeyValueRow> }
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
                            name="sex"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sexo</FormLabel>
                                    <FormControl>
                                        <Select disabled={loading} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue  placeholder="Sexo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="M">Masculino</SelectItem>
                                                <SelectItem value="F">Femenino</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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