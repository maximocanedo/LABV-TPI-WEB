'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React from "react";
import {IUser} from "../../../../entity/users";

export interface BasicInfoCardProps {
    user: IUser | null | undefined;
}

export const BasicInfoCard = ({ user }: BasicInfoCardProps) => {
    if(!user) return <></>;
    return (<Card>
        <CardHeader>
            <div className="font-semibold">Información básica</div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Nombre:</span>
                        <span>{user.name}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Nombre de usuario:</span>
                        <span>@{user.username}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <span>{user.active ? "Habilitado" : "Deshabilitado"}</span>
                    </li>
                </ul>
            </div>
        </CardContent>
    </Card>);
}