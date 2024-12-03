'use strict';

import {Calendar, UserRound} from "lucide-react";
import {AppointmentMinimalView, AppointmentStatus, IAppointment} from "../../../entity/appointments";
import {ViewMode} from "../../buttons/ViewModeControl";
import {TableCell, TableRow} from "../../ui/table";
import {Skeleton} from "../../ui/skeleton";
import {LocalAppointmentContextMenu} from "./AppointmentContextMenu";
import {Badge} from "../../ui/badge";
import {AppointmentMenu} from "./AppointmentMenu";

export interface AppointmentListItemProps {
    record: AppointmentMinimalView | IAppointment | null;
    isLoading?: boolean;
    viewMode?: ViewMode;
    onClick: (record: AppointmentMinimalView | IAppointment) => void;
    className?: string;
}

const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: 'numeric',
    month: 'short',
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
};
export const printDate = (date: Date) => new Date(date).toLocaleDateString('es-AR', options);


export const AppointmentListItem = ({record, isLoading, viewMode, onClick, className}: AppointmentListItemProps) => {

    if ((!record && !isLoading)) {
        return <></>;
    }
    let gridColsClass: string = (viewMode === ViewMode.COMFY ? "grid-rows-3" : (viewMode === ViewMode.COMPACT ? "grid-rows-2" : ""));
    if (isLoading) {
        let x = () => ["w-12", "w-14", "w-16", "w-20", "w-28"][Math.floor(Math.random() * 10) % 5];
        let y = () => ["w-20", "w-28", "w-32", "w-36", "w-40"][Math.floor(Math.random() * 10) % 5] + " max-w-2/3";

        return (<TableRow selectable={false}
                          className={"w-full " + (className ?? "") + ((isLoading ?? false) ? " border-0 " : '')}>
            <TableCell className={"w-[70px]"}><Skeleton className={"w-[52px] h-[14px] rounded"}/></TableCell>
            {viewMode != ViewMode.TABLE && <TableCell className={"grid items-center gap-[4px] " + (gridColsClass)}>
                {(viewMode === ViewMode.COMFY) && <Skeleton className={x() + " max-w-14 h-[10px] rounded-lg "}/>}
                <Skeleton className={y() + " min-w-16 h-[14px] rounded "}/>
                <Skeleton className={x() + " h-[12px] rounded "}/>
            </TableCell>}

            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={y() + " h-[14px] rounded "}/></TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={y() + " h-[14px] rounded "}/></TableCell>}

            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={x() + " h-[10px] rounded "}/></TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={x() + " h-[10px] rounded "}/></TableCell>}

        </TableRow>);
    }
    const opt: Record<AppointmentStatus, string> = {
        "PENDING": "Pendiente",
        "CANCELLED": "Cancelado",
        "ABSENT": "Ausente",
        "PRESENT": "Presente"
    };
    if (!record) return <></>;
    const fullNameArr: string = printDate(record.date);
    if (viewMode == ViewMode.LITTLE_CARDS) {
        return <div className=" border rounded-lg pr-5 overflow-hidden ">
            <TableRow selectable={false} className={"w-full" + (className ?? "")}>
                <TableCell
                    className={"w-[60px] text-center px-[18px] items-center justify-center rounded bg-muted"}><Calendar/></TableCell>
                <TableCell className={"pl-4 grid" + (gridColsClass)}>

                    <LocalAppointmentContextMenu patient={record}><div
                        className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"}
                        onClick={() => onClick(record)}>
                        {`#${record.id} · Dr. ${record.assignedDoctor.surname}`}{(!record.active) &&
                        <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}
                    </div>
                    <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                        {`${fullNameArr}`}
                    </div></LocalAppointmentContextMenu>
                </TableCell>
            </TableRow>
        </div>;
    }
    return (
        <TableRow selectable={false} className={"w-full " + (className ?? "") + " "}>
            <TableCell className={"w-[70px] text-center"}>{record.id}</TableCell>
            {viewMode != ViewMode.TABLE && <TableCell className={"grid" + (gridColsClass)}>
                <div className={"" + (viewMode == ViewMode.COMFY && " py-2")}>
                    {(!record.active && viewMode === ViewMode.COMFY) &&
                        <div><Badge variant={"outline"} className={"ml-[-10px]"}>Deshabilitado</Badge></div>}
                    <div
                        className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"}
                        onClick={() => onClick(record)}>
                        {fullNameArr}{(!record.active && viewMode === ViewMode.COMPACT) &&
                        <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}
                    </div>
                    <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                        {`b960`}
                    </div>
                </div>
            </TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell>
                    <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"}
                     onClick={() => onClick(record)}>
                    {`Dr. ${record.assignedDoctor.surname}, ${record.assignedDoctor.name}`}
                    </div>
            </TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell>
                <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"}
                     onClick={() => onClick(record)}>
                    {`${record.patient.surname}, ${record.patient.name}`}
                </div>
            </TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell>{opt[record.status]}</TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell>{fullNameArr}</TableCell>}
            <TableCell className={"w-[36px]"}>
                <AppointmentMenu {...record} />
            </TableCell>
        </TableRow>);
};