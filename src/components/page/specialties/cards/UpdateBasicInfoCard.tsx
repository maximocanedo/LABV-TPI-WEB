'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React, {useState} from "react";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {IUser, Permits} from "../../../../entity/users";
import {Input} from "../../../ui/input";
import {Label} from "../../../ui/label";
import { Button } from "../../../ui/button";
import * as data from "../../../../actions/specialties";
import {Spinner} from "../../../form/Spinner";
import {useToast} from "../../../ui/use-toast";
import {ToastAction} from "../../../ui/toast";
import {Specialty} from "../../../../entity/specialties";
import {Textarea} from "../../../ui/textarea";

export interface UpdateBasicInfoCardProps {
    record: Specialty;
    onUpdate: (updated: Specialty) => void;
}

export const UpdateBasicInfoCard = ({ record, onUpdate }: UpdateBasicInfoCardProps) => {
    const { me, setCurrentUser, can } = useCurrentUser();
    const { toast } = useToast();
    const [name, setName] = useState<string>(record.name);
    const [description, setDescription] = useState<string>(record.description);
    const [loading, setLoading] = useState<boolean>(false);
    if(!me || me == "loading" || !record.active) return <></>;
    const canEdit: boolean = can(Permits.UPDATE_SPECIALTY);
    if(!canEdit) return <></>;

    const update = () => {
        setLoading(true);
        data.update(record.id, { name, description })
            .then(updated => {
                setName(updated.name);
                onUpdate(updated);
                toast({
                    title: "Operación exitosa. ",
                    description: "Los datos fueron guardados correctamente. "
                });
            })
            .catch(err => {
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
    };

    const ableToSubmit: boolean = (name.trim() != "" && description.trim() != "") && (record.name != name || record.description != description);

    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Actualizar información</div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                <Label htmlFor={record.name+"$updateNameInput"}>Nombre</Label>
                <Input disabled={!canEdit || loading} type={"text"} id={record.name+"$updateNameInput"} value={name} onChange={x=>setName(x.target.value)} />

                <Label htmlFor={record.description+"$updateNameInput"}>Descripción</Label>
                <Textarea className={"h-max"} disabled={!canEdit || loading} id={record.description+"$updateNameInput"} value={description} onChange={x=>setDescription(x.target.value)} />
                { ableToSubmit && <div className="flex flex-1 justify-end">
                        <Button onClick={update} disabled={loading || name.trim() === ""} variant={"default"}>{loading && <Spinner className={"mr-3"} />}{ loading ? "Guardando" : "Guardar cambios"}</Button>
                    </div> }
            </div>
        </CardContent>
    </Card>);
};