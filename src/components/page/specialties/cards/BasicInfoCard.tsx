'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React from "react";
import {Specialty} from "../../../../entity/specialties";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";

export interface BasicInfoCardProps {
    specialty: Specialty | null | undefined;
}

export const BasicInfoCard = ({ specialty }: BasicInfoCardProps) => {
    if(!specialty) return <></>;
    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Información básica</div>
        </CardHeader>
        <CardContent>
            <KeyValueList>
                <KeyValueRow title={"Nombre"}>{specialty.name}</KeyValueRow>
                <KeyValueRow title={"Descripción"}>{specialty.description}</KeyValueRow>
                <KeyValueRow title={"Estado"}>{specialty.active ? "Habilitado" : "Deshabilitado"}</KeyValueRow>
            </KeyValueList>
        </CardContent>
    </Card>);
}