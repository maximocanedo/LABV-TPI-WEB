'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React, {useContext} from "react";
import {CurrentAppointmentContext} from "../CurrentAppointmentContext";

export interface BasicInfoCardProps { }

const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: 'numeric',
    month: 'short',
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
};
export const printDate = (date: Date) => date.toLocaleDateString('es-AR', options);
export const BasicInfoCard = ({ }: BasicInfoCardProps) => {
    const {record, updater} = useContext(CurrentAppointmentContext);

    if(!record || !record.id) return null;
    return (<Card className={"card"}>
            <CardHeader>
                <div className="font-semibold">Información básica</div>
            </CardHeader>
            <CardContent>
                { <KeyValueList>
                    <KeyValueRow title={"ID N.º"}>{record.id}</KeyValueRow>
                    <KeyValueRow title={"Fecha"}>{printDate(new Date(record.date))}</KeyValueRow>
                    {record.remarks && record.remarks.length > 0 && <KeyValueRow title={"Observaciones"}>{record.remarks}</KeyValueRow>}
                    <KeyValueRow title={"Estado"}>{record.status}</KeyValueRow>
                </KeyValueList> }
            </CardContent>
            </Card>);
};

