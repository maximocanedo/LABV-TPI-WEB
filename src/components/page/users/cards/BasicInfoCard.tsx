'use strict';

import { useContext } from "react";
import { KeyValueList } from "../../../containers/page-tools/KeyValueList";
import { KeyValueRow } from "../../../containers/page-tools/KeyValueRow";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { CurrentUserContext } from "../CurrentUserContext";

export interface BasicInfoCardProps {
}

export const BasicInfoCard = ({ }: BasicInfoCardProps) => {
    const { record: user, updater } = useContext(CurrentUserContext);
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