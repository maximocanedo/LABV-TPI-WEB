'use strict';

import {useCurrentUser} from "../../../users/CurrentUserContext";
import {IUser, Permits} from "../../../../entity/users";
import React, {useContext, useState} from "react";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {Button} from "../../../ui/button";
import {Spinner} from "../../../form/Spinner";
import * as users from "../../../../actions/users";
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
import { CurrentUserContext } from "../CurrentUserContext";

export interface UserStateCardProps {
}

export const UserStateCard = ({ }: UserStateCardProps) => {
    const { record: user, updater } = useContext(CurrentUserContext);
    const onUpdate = (active: boolean) => user && updater({ ...user, active });
    const { me } = useCurrentUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    if(!me || me == "loading" || !user) return <></>;
    const canEdit: boolean = me.active && ((me.access??[]).some(x=>x===Permits.DELETE_OR_ENABLE_USER));
    if(!canEdit || user.username === "root") return <></>;
    const itsMe = () => me.username === user.username;
    const update = () => {
        setLoading(true);
        users[user.active ? "disable" : "enable"](user.username)
            .then((ok) => {
                if(ok) {
                    onUpdate(!user.active);
                    toast({
                        title: "Operación exitosa. ",
                        description: `El usuario @${user.username} fue ${!user.active ? "habilitado" : "deshabilitado"} correctamente. `
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
    return (<Card className={"card my-3"}>
        <CardHeader>
            <div className="font-semibold">{user.active ? "Deshabilitar" : "Habilitar"} registro</div>
        </CardHeader>
        <CardContent>
            <div className="grid place-items-center mb-3">
                {user.active && "Al deshabilitar este registro, se rechazará cualquier acción que requiera de este. "}
                {!user.active && "Habilitá este registro para poder trabajar con él. "}
            </div>
            <div className="grid gap-3">
                <div className="flex flex-1 justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={loading} variant={user.active ? "destructive" : "default"}>{loading && <Spinner className={"mr-3"} />}{ loading ? (user.active ? "Deshabilitando" : "Habilitando") : (user.active ? "Deshabilitar" : "Habilitar")}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">Estás a punto de {user.active ? "deshabilitar" : "habilitar"} este registro. </AlertDialogTitle>
                                <AlertDialogDescription>
                                    ¿Estás seguro de continuar?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={update}>{user.active ? "Deshabilitar" : "Habilitar"}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </CardContent>
    </Card>);
}