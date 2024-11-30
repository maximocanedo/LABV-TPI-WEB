'use strict';

import {useCurrentUser} from "../../../users/CurrentUserContext";
import {Permits} from "../../../../entity/users";
import React, {useContext, useState} from "react";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {Button} from "../../../ui/button";
import {Spinner} from "../../../form/Spinner";
import * as data from "../../../../actions/patients";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import {useToast} from "../../../ui/use-toast";
import {ToastAction} from "../../../ui/toast";
import {IDoctor} from "../../../../entity/doctors";
import {CurrentPatientContext} from "../CurrentPatientContext";

export interface StateCardProps {

}

export const StateCard = ({ }: StateCardProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { me, can } = useCurrentUser();
    const {record, updater } = useContext(CurrentPatientContext);
    const { toast } = useToast();


    const canEdit: boolean = can?.(Permits.DISABLE_PATIENT) ?? false;
    const update = () => {
        if(!record) return;
        setLoading(true);
        data[record.active ? "disable" : "enable"](record.id)
            .then((ok) => {
                if(ok) {
                    updater({ ...record, active: !record.active });
                    toast({
                        title: "Operación exitosa. ",
                        description: `El registro fue ${!record.active ? "habilitado" : "deshabilitado"} correctamente. `
                    });
                }
                else {
                    toast({
                        variant: "destructive",
                        title: "Algo salió mal. ",
                        description: "Hubo un error desconocido al intentar realizar esta acción. ",
                        action: <ToastAction onClick={update} altText="Reintentar">Reintentar</ToastAction>
                    });
                }
            })
            .catch(err => {
                toast({
                    variant: "destructive",
                    title: err.message?? "Algo salió mal. ",
                    description: err.description?? "Hubo un error desconocido al intentar realizar esta acción. ",
                    action: <ToastAction onClick={update} altText="Reintentar">Reintentar</ToastAction>
                });
            })
            .finally(() => setLoading(false));
    };
    if(!record || !me || me == "loading") return <></>;
    if(!canEdit) return <></>;
    return (<Card className={"card my-3"}>
        <CardHeader>
            <div className="font-semibold">{record.active ? "Deshabilitar" : "Habilitar"} registro</div>
        </CardHeader>
        <CardContent>
            <div className="grid place-items-center mb-3">
                {record.active && "Al deshabilitar este registro, se rechazará cualquier acción que requiera de este. "}
                {!record.active && "Habilitá este registro para poder trabajar con él. "}
            </div>
            <div className="grid gap-3">
                <div className="flex flex-1 justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={loading} variant={record.active ? "destructive" : "default"}>{loading && <Spinner className={"mr-3"} />}{ loading ? (record.active ? "Deshabilitando" : "Habilitando") : (record.active ? "Deshabilitar" : "Habilitar")}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">Estás a punto de {record.active ? "deshabilitar" : "habilitar"} este registro. </AlertDialogTitle>
                                <AlertDialogDescription>
                                    ¿Estás seguro de continuar?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => update()}>{record.active ? "Deshabilitar" : "Habilitar"}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </CardContent>
    </Card>);
}