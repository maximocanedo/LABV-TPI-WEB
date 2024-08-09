'use strict';
import {Doctor} from "../../../../entity/doctors";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React from "react";
import {BasicInfoCardProps} from "./BasicInfoCard";

export const CommunicationInfoCard = ({ record: e }: BasicInfoCardProps) => {
    const record = e as Doctor;
    if(!e || (!record.phone && !record.email)) return <></>;
    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Información de contacto</div>
        </CardHeader>
        <CardContent>
            <KeyValueList>
                <KeyValueRow title={"Número de teléfono"}>{record.phone}</KeyValueRow>
                <KeyValueRow title={"Correo electrónico"}>{record.email}</KeyValueRow>
            </KeyValueList>
        </CardContent>
    </Card>);
};