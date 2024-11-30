'use strict';

import {ViewMode} from "../buttons/ViewModeControl";
import {DoctorMinimalView} from "../../entity/doctors";
import {TableCell, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {SpecialtyLink} from "../dialog-selectors/specialty/SpecialtyLink";
import {UserLink} from "../dialog-selectors/users/UserLink";
import {DoctorScheduleCollapsibleCell} from "../containers/commons/DoctorScheduleCollapsibleCell";
import {Skeleton} from "../ui/skeleton";
import {IPatient, PatientCommunicationView} from "../../entity/patients";
import {UserRound} from "lucide-react";

export interface PatientListItemProps {
    record: PatientCommunicationView | IPatient | null;
    isLoading?: boolean;
    viewMode?: ViewMode;
    onClick: (record: PatientCommunicationView | IPatient) => void;
    className?: string;
}

export const dni = (n: string): string => {
    return new Intl.NumberFormat('es-AR').format(Number(n).valueOf());
}

export const PatientListItem = ({ record, isLoading, viewMode, onClick, className }: PatientListItemProps) => {

    if((!record && !isLoading)) {
        return <></>;
    }
    let gridColsClass: string = (viewMode === ViewMode.COMFY ? "grid-rows-3" : (viewMode === ViewMode.COMPACT ? "grid-rows-2" : "") );
    if(isLoading) {
        let x = () => ["w-12", "w-14", "w-16", "w-20", "w-28"][Math.floor(Math.random() * 10) % 5];
        let y = () => ["w-20", "w-28", "w-32", "w-36", "w-40"][Math.floor(Math.random() * 10) % 5] + " max-w-2/3";

        return (<TableRow selectable={false} className={"w-full " + (className??"") + ((isLoading?? false) ? " border-0 ":'')}>
            <TableCell className={"w-[70px]"}><Skeleton className={"w-[52px] h-[14px] rounded"} /></TableCell>
            { viewMode != ViewMode.TABLE && <TableCell className={"grid items-center gap-[4px] " + (gridColsClass)}>
                {(viewMode === ViewMode.COMFY) && <Skeleton className={x() + " max-w-14 h-[10px] rounded-lg "} />}
                <Skeleton className={y() + " min-w-16 h-[14px] rounded "} />
                <Skeleton className={x() + " h-[12px] rounded "} />
            </TableCell>}

            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={y() + " h-[14px] rounded "} /></TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={y() + " h-[14px] rounded "} /></TableCell>}

            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={x() + " h-[10px] rounded "}/></TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={x() + " h-[10px] rounded "}/></TableCell>}

        </TableRow>);
    }
    if(!record) return <></>;
    const fullNameArr: string = record.surname + ", " + record.name;
    if(viewMode == ViewMode.LITTLE_CARDS) {
        return <div className=" border rounded-lg pr-5 overflow-hidden ">
            <TableRow selectable={false} className={"w-full" + (className??"")}>
                <TableCell className={"w-[60px] text-center px-[18px] items-center justify-center rounded bg-muted"}><UserRound /></TableCell>
                <TableCell className={"pl-4 grid" + (gridColsClass)}>
                    <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"} onClick={() => onClick(record)}>
                        {fullNameArr}{(!record.active) && <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}
                    </div>
                    <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                        {`D.N.I. N.º: ${dni(record.dni)}`}
                    </div>
                </TableCell>
            </TableRow>
        </div>;
    }
    return (<TableRow selectable={false} className={"w-full " + (className??"") + " "}>
        <TableCell className={"w-[70px] text-center"}>{ record.id }</TableCell>
        { viewMode != ViewMode.TABLE && <TableCell className={"grid" + (gridColsClass)}>
            <div className={"" + (viewMode == ViewMode.COMFY && " py-2")}>
                {(!record.active && viewMode === ViewMode.COMFY) &&
                    <div><Badge variant={"outline"} className={"ml-[-10px]"}>Deshabilitado</Badge></div>}
                <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"}
                     onClick={() => onClick(record)}>
                    {fullNameArr}{(!record.active && viewMode === ViewMode.COMPACT) &&
                    <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}
                </div>
                <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                    {`D.N.I. N.º: ${dni(record.dni)}`}
                </div>
            </div>
        </TableCell>}
        {viewMode === ViewMode.TABLE && <TableCell>
            <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"}
                 onClick={() => onClick(record)}>
                {fullNameArr}
            </div>
        </TableCell>}
        {viewMode === ViewMode.TABLE && <TableCell>{dni(record.dni)}</TableCell>}
        {viewMode === ViewMode.TABLE && "email" in record && <TableCell>{record.email}</TableCell>}
        {viewMode === ViewMode.TABLE && "phone" in record && <TableCell>{record.phone}</TableCell>}
        {viewMode === ViewMode.TABLE && <TableCell>{record.active ? "Habilitado" : "Deshabilitado"}</TableCell>}
    </TableRow>);
};