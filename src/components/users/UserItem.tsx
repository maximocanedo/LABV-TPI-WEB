'use strict';

import {IUser} from "../../entity/users";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import React from "react";
import {UserContextMenu} from "./UserContextMenu";

export interface UserItemProps {
    user: IUser;
}
export const UserItem = ({user}: UserItemProps) => {

    return (<UserContextMenu user={user}>
        <Card>
            <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
                {!user.active && <i>Usuario deshabilitado. </i>}
            </CardFooter>
        </Card>
    </UserContextMenu>)
}