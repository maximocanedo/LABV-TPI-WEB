'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React, {useContext} from "react";
import {IDoctor} from "../../../../entity/doctors";
import {ScheduleList} from "../../../doctors/schedules/ScheduleList";
import {Button} from "../../../ui/button";
import {CurrentDoctorContext} from "../CurrentDoctorContext";
import { ScheduleDialog } from "src/components/dialog-selectors/doctors/schedules/ScheduleDialog";
import { Plus } from "lucide-react";

export interface ScheduleChartCardProps {
}

export const ScheduleChartCard = ({ }: ScheduleChartCardProps) => {
    const {record} = useContext(CurrentDoctorContext);
    if(!record || !record.schedules) return null;
    return (<Card className={"card"}>
        <CardHeader className={(!record.schedules.length && "pb-2" || "")+" pt-4"}>
            <div className="font-semibold w-full flex flex-row gap-2"><span className="w-full flex justify-start items-center">Horarios</span>{!!record.schedules.length && <ScheduleDialog><Button variant="ghost" size="icon" type="button"><Plus /></Button></ScheduleDialog>}</div>
            
        </CardHeader>
        <CardContent className={!record.schedules.length && "p-2" || ""}>
            <ScheduleList />
            <ScheduleDialog>
                {!record.schedules.length && <div className={"flex flex-col w-full border-2 py-2 hover:bg-muted cursor-pointer rounded-lg border-dashed border-accent min-h-16"}>
                    <div className="text-center py-2 pt-4 w-full font-bold">Registrar horario</div>
                    <div className="text-center pb-4 text-xs text-muted-foreground w-full">Este médico aún no cuenta con horarios.</div>
                    <div className={"grid place-items-center pb-4"}>
                        <Button size={"sm"} type="button">Crear</Button>
                    </div>
                </div>}
            </ScheduleDialog>            
        </CardContent>
    </Card>);
};