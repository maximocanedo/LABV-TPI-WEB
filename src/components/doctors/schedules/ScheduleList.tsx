'use strict';

import {IDoctor} from "../../../entity/doctors";
import {printSchedule} from "../../containers/commons/DoctorScheduleCollapsibleCell";

export interface ScheduleListProps {
    record: IDoctor;
}

export const ScheduleList = ({record}: ScheduleListProps) => {
    if(!record || !record.schedules || !record.schedules.length) return null;
    return (<div className={"flex flex-col w-full divide-y divide-muted"}>
        { record.schedules.map((schedule) => <div className={"w-full p-2"}>
            {printSchedule(schedule)}
        </div>) }
    </div>);
}