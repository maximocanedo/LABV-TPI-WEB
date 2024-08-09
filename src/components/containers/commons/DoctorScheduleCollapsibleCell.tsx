'use strict';

import {Schedule, weekday} from "../../../entity/doctors";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../../ui/collapsible";
import {CaretSortIcon} from "@radix-ui/react-icons";
import {Button} from "../../ui/button";

export interface DoctorScheduleCollapsibleCellProps {
    schedules: Schedule[];
}
type nativeDateWeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const dateWeekdayNumberToWeekday = (w: nativeDateWeekdayNumber): weekday => {
    switch(w) {
        case 0: return "SUNDAY";
        case 1: return "MONDAY";
        case 2: return "TUESDAY";
        case 3: return "WEDNESDAY";
        case 4: return "THURSDAY";
        case 5: return "FRIDAY";
        case 6: return "SATURDAY";
    }
}
const getTodaysWeekday = (): weekday => {
    const date = new Date();
    const wd: weekday = dateWeekdayNumberToWeekday(date.getDay() as nativeDateWeekdayNumber);
    return wd;
}
const getNextSchedule = (schedules: Schedule[], weekdayBase: weekday = getTodaysWeekday()): Schedule | null => {
    const scheduleForDay = (wd: weekday): Schedule | null => {
        for(let i = 0; i < schedules.length; i++) {
            if(schedules[i].beginDay === wd) return schedules[i];
        }
        return null;
    }
    let weekdays: weekday[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const getWDIndexOf = (w: weekday): number => weekdays.indexOf(w);
    for(let i = 0; i < 7; i++) {
        let currentWeekday = weekdays[(getWDIndexOf(weekdayBase) + i) % 7];
        const s: Schedule | null = scheduleForDay(currentWeekday);
        if(s) return s;
    }
    return null;
};

const weekdayInSpanish: Record<weekday, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo"
};
export const printSchedule = (s: Schedule): string => {
    //return `Miércoles 23:59 - Miércoles 23:59`;
    return `${weekdayInSpanish[s.beginDay]} ${s.startTime.slice(0,5)} → ${s.beginDay !== s.finishDay ? weekdayInSpanish[s.finishDay] + " ":''} ${s.endTime.slice(0,5)}`;
}

export const DoctorScheduleCollapsibleCell = ({ schedules }: DoctorScheduleCollapsibleCellProps) => {
    if(schedules.length === 0) return <span>Sin horarios</span>
    const nextSchedule: Schedule = getNextSchedule(schedules) as Schedule;
    const rest = [ ...schedules ].filter(s => s.id != nextSchedule.id);
    return <Collapsible className={"min-w-[230px] max-w-[320px]"}>
        <div className="flex items-center justify-between space-x-4">
            <span>{printSchedule(nextSchedule)}</span>
            <CollapsibleTrigger asChild>
                <Button disabled={schedules.length === 1} variant="ghost" size="sm">
                    <CaretSortIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                </Button>
            </CollapsibleTrigger>
        </div>
            <CollapsibleContent className={"flex flex-col gap-1.5 mr-[56px] mb-1.5 items-start justify-between"}>
                {rest.map(x => <span>{printSchedule(x)}</span>)}
            </CollapsibleContent>
    </Collapsible>
;
};