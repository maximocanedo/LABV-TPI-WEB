'use strict';
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { resolveLocalUrl } from "src/auth";
import { UserButtonSelector } from "src/components/dialog-selectors/users/UserButtonSelector";
import { DoctorListItem } from "src/components/doctors/DoctorListItem";
import { z } from "zod";
import * as users from "../../../../actions/users";
import { IUser, Permits } from "../../../../entity/users";
import { Spinner } from "../../../form/Spinner";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import { useToast } from "../../../ui/use-toast";
import { useCurrentUser } from "../../../users/CurrentUserContext";
import { CurrentUserContext } from "../CurrentUserContext";
import { ViewMode } from "src/components/buttons/ViewModeControl";
import { DoctorButtonSelector } from "src/components/dialog-selectors/doctors/DoctorButtonSelector";
import { IDoctor } from "src/entity/doctors";

export interface LinkedDoctorCardProps {
}
const specialtySchema = z.object({
    name: z.string(),
    id: z.number(),
    file: z.number(),
    active: z.boolean()
}).refine(val => val !== null, {
    message: "Debe seleccionar un usuario. "
});
const formSchema = z.object({
    doctor: specialtySchema
});


const getUpdatedValues = (u: IUser, values: z.infer<typeof formSchema>): IUser | null => {
    // @ts-ignore
    let v: IUser = {};
    let i = 0;
    // @ts-ignore
    if(u.doctor != null && values.doctor != null && u.doctor.id !== values.doctor.id) v = { ...v, doctor: values.doctor };
    if(i) return null;
    else return v;
}

export const LinkedDoctorCard = ({ }: LinkedDoctorCardProps) => {
    const {record, updater} = useContext(CurrentUserContext);
    const { me, can } = useCurrentUser();
    const navigate = useNavigate();
    const canEdit: boolean = can(Permits.UPDATE_DOCTOR_PERSONAL_DATA);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            doctor: record?.doctor?? { id: -1, file: -1 }
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
        users.update(record.username, { ...updatedValues })
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
            }); //* /
    };



    if(!record || !record.username) return null;
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className={"card"}>
            <CardHeader>
                <div className="font-semibold">Médico vinculado</div>
            </CardHeader>
            <CardContent>
                { !editMode && <DoctorListItem viewMode={ViewMode.LITTLE_CARDS} record={record.doctor?? null} onClick={doctor => {
                    navigate(resolveLocalUrl('/doctors/' + doctor.file));
                }}  /> }
                { editMode && <div className={"flex flex-col gap-3"}>
                    <FormField
                        control={form.control}
                        name="doctor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Médico</FormLabel>
                                <FormControl>
                                    <DoctorButtonSelector value={field.value as IDoctor} onChange={field.onChange} />
                                    { /* <UserButtonSelector value={field.value} onChange={(val) => {
                                        field.onChange(val);
                                    }} /> */ }
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

//*/