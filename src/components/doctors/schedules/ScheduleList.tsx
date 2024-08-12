'use strict';

import { useContext, useState } from "react";
import {IDoctor, Schedule} from "../../../entity/doctors";
import {printSchedule} from "../../containers/commons/DoctorScheduleCollapsibleCell";
import { CurrentDoctorContext } from "src/components/page/doctors/CurrentDoctorContext";
import { Trash } from "lucide-react";
import { Button } from "src/components/ui/button";
import * as doctors from "../../../actions/doctors";
import { useToast } from "src/components/ui/use-toast";
import { Spinner } from "src/components/form/Spinner";

export interface ScheduleListProps {
}
export interface ScheduleRowProps {
    schedule: Schedule;
}

export const ScheduleRow = ({ schedule }: ScheduleRowProps) => {
    const [hovering, setHovering] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const {record, updater} = useContext(CurrentDoctorContext);
    const {toast} = useToast();
    if(!record || !record.schedules || !record.schedules.length) return null;
    const del = () => {
        setLoading(true);
        doctors.deleteSchedule(schedule.id, record.file)
            .then(schedules => {
                updater({ ...record, schedules });
                toast({
                    description: "Operación exitosa. "
                });
            })
            .catch(err => {
                toast({
                    variant: "destructive",
                    title: err.path ? err.message : "Algo salió mal. ",
                    description: err.path ? err.description : "Hubo un error al intentar eliminar este horario. "
                });
            })
            .finally(() => setLoading(false));
    };
    return (<div onMouseOver={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className={" h-auto min-h-[36px] w-full p-2 flex flex-row gap-2 items-center "}>
        <span className="w-full h-auto min-h-[36px] flex items-center">{printSchedule(schedule)}</span>
        {hovering && <Button variant="ghost" onClick={() => del()} size="icon">{!loading ? <Trash size={16} /> : <Spinner className={"w-4 h-4"} />}</Button>}
    </div>);
}

export const ScheduleList = ({}: ScheduleListProps) => {
    const {record, updater} = useContext(CurrentDoctorContext);
    if(!record || !record.schedules || !record.schedules.length) return null;

    return (<div className={"flex flex-col w-full divide-y divide-muted"}>
        { record.schedules.map((schedule) => <ScheduleRow schedule={schedule} />) }
    </div>);
}