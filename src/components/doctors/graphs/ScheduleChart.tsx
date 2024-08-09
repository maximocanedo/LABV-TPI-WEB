'use strict';

import {IDoctor} from "../../../entity/doctors";

export interface ScheduleChartProps {
    record: IDoctor;
}

export const ScheduleChart = ({ record: { schedules } }: ScheduleChartProps) => {
    if(!schedules || !schedules.length) return <></>;
    console.log(schedules);
    return (<div className={""}></div>);
}