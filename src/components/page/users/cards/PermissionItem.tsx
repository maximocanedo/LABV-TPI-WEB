'use strict';


import {IUser, Permit, Permits} from "../../../../entity/users";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import React, {useState} from "react";
import {Checkbox} from "../../../ui/checkbox";
import {CheckedState} from "@radix-ui/react-checkbox";
import * as users from "../../../../actions/users";
import {ToastAction} from "../../../ui/toast";
import {useToast} from "../../../ui/use-toast";

export interface PermissionItemProps {
    user: IUser;
    action: Permit;
    label: string;
}

export const PermissionItem = ({user, action, label}: PermissionItemProps) => {
    const { me } = useCurrentUser();
    const { toast } = useToast();
    let canGrant: boolean = false;
    if(!me || me == "loading" || user.username == "root" || !user.active) canGrant = false;
    else canGrant = (me.access??[]).some(p => p === Permits.GRANT_PERMISSIONS);
    const [loading, setLoading] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>((user.access??[]).some(x=>x===action));
    const update = (checked: CheckedState) => {
        if(checked == "indeterminate") return;
        setLoading(true);
        users[checked ? "grantOne" : "denyOne"](user.username, action)
            .then(permit => {
                setChecked(permit.allowed);
            }).catch(err => {
                toast({
                    variant: "destructive",
                    title: err.message?? "Algo salió mal. ",
                    description: err.description?? "Hubo un error desconocido al intentar conceder o denegar un permiso. ",
                    action: <ToastAction onClick={() => update(checked)} altText="Reintentar">Reintentar</ToastAction>
                });
                setChecked((user.access??[]).some(x=>x===action));
            }).finally(() => {
                setLoading(false);
            });
    }


    return (<div className={"flex items-center p-1 gap-3"}>
            <Checkbox onCheckedChange={update} id={user.username + "@" + action} disabled={!canGrant || loading} checked={checked} />
            <label htmlFor={user.username + "@" + action} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label??action}</label>
        </div>);
};