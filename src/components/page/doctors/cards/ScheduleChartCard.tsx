'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import {KeyValueList} from "../../../containers/page-tools/KeyValueList";
import {KeyValueRow} from "../../../containers/page-tools/KeyValueRow";
import React from "react";
import {IDoctor} from "../../../../entity/doctors";
import {ScheduleChart} from "../../../doctors/graphs/ScheduleChart";
import {ScheduleList} from "../../../doctors/schedules/ScheduleList";
import {Button} from "../../../ui/button";

export interface ScheduleChartCardProps {
    record: IDoctor;
}

export const ScheduleChartCard = ({ record }: ScheduleChartCardProps) => {
    if(!record || !record.schedules) return null;
    return (<Card className={"card"}>
        <CardHeader className={!record.schedules.length && "pb-2" || ""}>
            <div className="font-semibold">Horarios</div>
        </CardHeader>
        <CardContent className={!record.schedules.length && "p-2" || ""}>
            <ScheduleList record={record} />
            {!record.schedules.length && <div className={"flex flex-col w-full border-2 py-2 hover:bg-muted cursor-pointer rounded-lg border-dashed border-accent min-h-16"}>
                <div className="text-center py-2 pt-4 w-full font-bold">Registrar horario</div>
                <div className="text-center pb-4 text-xs text-muted-foreground w-full">Este médico aún no cuenta con horarios.</div>
                <div className={"grid place-items-center pb-4"}>
                    <Button size={"sm"}>Crear</Button>
                </div>
            </div>}
        </CardContent>
    </Card>);
};