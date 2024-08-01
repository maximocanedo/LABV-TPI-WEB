'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React, {useState} from "react";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {IUser, Permits} from "../../../../entity/users";
import {Input} from "../../../ui/input";
import {Label} from "../../../ui/label";
import { Button } from "../../../ui/button";
import * as users from "../../../../actions/users";
import {Spinner} from "../../../form/Spinner";

export interface UpdateBasicInfoCardProps {
    user: IUser;
    onUpdate: (updated: IUser) => void;
}

export const UpdateBasicInfoCard = ({ user, onUpdate }: UpdateBasicInfoCardProps) => {
    const { me, setCurrentUser } = useCurrentUser();
    const [name, setName] = useState<string>(user.name);
    const [loading, setLoading] = useState<boolean>(false);
    if(!me || me == "loading" || !user.active) return <></>;
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
                }).catch(console.error)
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
                }).catch(console.error)
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