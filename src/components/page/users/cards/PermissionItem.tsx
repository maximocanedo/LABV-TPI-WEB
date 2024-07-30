'use strict';


import {IUser, Permit} from "../../../../entity/users";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import {useState} from "react";
import {Checkbox} from "../../../ui/checkbox";

export interface PermissionItemProps {
    user: IUser;
    action: Permit | string;
    label: string;
}

export const PermissionItem = ({user, action, label}: PermissionItemProps) => {
    const { me } = useCurrentUser();
    const [loading, setLoading] = useState<boolean>(false);
    return (<div className={"flex items-center p-1 gap-3"}>
            <Checkbox id={user.username + "@" + action} checked={(user.access??[]).some(x => x === action)} />
            <label
                htmlFor={user.username + "@" + action}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >{label??action}</label>
        </div>);
};