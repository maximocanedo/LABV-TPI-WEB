'use strict';
import {Doctor} from "../../../../entity/doctors";
import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React from "react";
import {BasicInfoCardProps} from "./BasicInfoCard";

export const PrivateInfoCard = ({ record: e }: BasicInfoCardProps) => {
    const record = e as Doctor;
    if(!e || (!record.birth && !record.address && !record.sex && !record.localty)) return <></>;
    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Información sensible</div>
        </CardHeader>
        <CardContent>
            <KeyValueList>
                { record.sex && <KeyValueRow title={"Sexo"}>{{"M": "Masculino", "F": "Femenino"}[record.sex]}</KeyValueRow> }
                { record.address && <KeyValueRow title={"Dirección"}>{record.address}</KeyValueRow> }
                { record.localty && <KeyValueRow title={"Localidad"}>{record.localty}</KeyValueRow> }
                { record.birth && <KeyValueRow title={"Fecha de nacimiento"}>{new Date(record.birth).toLocaleDateString()}</KeyValueRow> }
            </KeyValueList>
        </CardContent>
    </Card>);
};