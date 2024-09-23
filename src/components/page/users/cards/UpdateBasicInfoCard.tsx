'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React, {useContext, useState} from "react";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {IUser, Permits} from "../../../../entity/users";
import {Input} from "../../../ui/input";
import {Label} from "../../../ui/label";
import { Button } from "../../../ui/button";
import * as users from "../../../../actions/users";
import {Spinner} from "../../../form/Spinner";
import {useToast} from "../../../ui/use-toast";
import {ToastAction} from "../../../ui/toast";
import { CurrentUserContext } from "../CurrentUserContext";

export interface UpdateBasicInfoCardProps {
}

export const UpdateBasicInfoCard = ({ }: UpdateBasicInfoCardProps) => {
    const { record: user, updater } = useContext(CurrentUserContext);
    const onUpdate = (u: IUser) => updater({ ...user, ...u });
    const { me, setCurrentUser } = useCurrentUser();
    const { toast } = useToast();
    const [name, setName] = useState<string>(user?.name??"");
    const [loading, setLoading] = useState<boolean>(false);
    if(!me || me == "loading" || !user?.active) return <></>;
    const canEdit: boolean = me.active && (me.username === user.username || (me.access??[]).some(x=>x===Permits.UPDATE_USER_DATA));
    if(!canEdit) return <></>;
    const itsMe = () => me.username === user.username;
    const update = () => {
        setLoading(true);
        if(!itsMe()) { // @ts-ignore
            users.update(user.username, { name })
                .then(updated => {
                    setName(updated.name);
                    onUpdate(updated);
                    toast({
                        title: "Operación exitosa. ",
                        description: "Se cambió el nombre correctamente. "
                    });
                }).catch(err => {
                    toast({
                        variant: "destructive",
                        title: err.message?? "Algo salió mal. ",
                        description: err.description?? "Hubo un error desconocido al intentar guardar los cambios. ",
                        action: <ToastAction onClick={update} altText="Reintentar">Reintentar</ToastAction>
                    });
            })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // @ts-ignore
            users.updateMe({ name })
                .then(updated => {
                    setName(updated.name);
                    onUpdate(updated);
                    setCurrentUser({ ...me, name: updated.name });
                    toast({
                        title: "Operación exitosa. ",
                        description: "Cambiaste tu nombre correctamente. "
                    });
                }).catch(err => {
                    toast({
                        variant: "destructive",
                        title: err.message?? "Algo salió mal. ",
                        description: err.description?? "Hubo un error desconocido al intentar guardar los cambios. ",
                        action: <ToastAction onClick={update} altText="Reintentar">Reintentar</ToastAction>
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Actualizar información</div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                <Label htmlFor={user.username+"$updateNameInput"}>Nombre</Label>
                <Input disabled={!canEdit || loading} type={"text"} id={user.username+"$updateNameInput"} value={name} onChange={x=>setName(x.target.value)} />
                { (name.trim() != "" && user.name != name) && <div className="flex flex-1 justify-end">
                        <Button onClick={update} disabled={loading || name.trim() === ""} variant={"default"}>{loading && <Spinner className={"mr-3"} />}{ loading ? "Guardando" : "Guardar cambios"}</Button>
                    </div>}
            </div>
        </CardContent>
    </Card>);
};