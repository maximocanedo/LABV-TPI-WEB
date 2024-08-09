'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React from "react";
import {IUser} from "../../../../entity/users";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";

export interface BasicInfoCardProps {
    user: IUser | null | undefined;
}

export const BasicInfoCard = ({ user }: BasicInfoCardProps) => {
    if(!user) return <></>;
    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Información básica</div>
        </CardHeader>
        <CardContent>
            <KeyValueList>
                <KeyValueRow title={"Nombre"}>{user.name}</KeyValueRow>
                <KeyValueRow title={"Nombre de usuario"}>{user.username}</KeyValueRow>
                <KeyValueRow title={"Estado"}>{user.active?"Habilitado":"Deshabilitado"}</KeyValueRow>
            </KeyValueList>
        </CardContent>
    </Card>);
}