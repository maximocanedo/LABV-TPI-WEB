'use strict';

import {IUser} from "../../../entity/users";
import {Link} from "react-router-dom";
import {resolveLocalUrl} from "../../../auth";

export interface UserLinkProps {
    record: IUser;
    showOnlyUsername?: boolean;
}

export const UserLink = ({ record, showOnlyUsername }: UserLinkProps) => {

    return <Link className={" hover:underline"} to={resolveLocalUrl("/users/" + record.username)}>{
        ((!(showOnlyUsername?? false) && record.name && record.name.trim().length > 0)) ? record.name : "@" + record.username
    }</Link>
}