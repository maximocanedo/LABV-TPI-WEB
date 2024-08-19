'use strict';

import {ViewMode} from "../buttons/ViewModeControl";
import {DoctorMinimalView} from "../../entity/doctors";
import {TableCell, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {SpecialtyLink} from "../dialog-selectors/specialty/SpecialtyLink";
import {UserLink} from "../dialog-selectors/users/UserLink";
import {DoctorScheduleCollapsibleCell} from "../containers/commons/DoctorScheduleCollapsibleCell";
import {Skeleton} from "../ui/skeleton";

export interface DoctorListItemProps {
    record: DoctorMinimalView | null;
    isLoading?: boolean;
    viewMode?: ViewMode;
    onClick: (record: DoctorMinimalView) => void;
    className?: string;
}

export const DoctorListItem = ({ record, isLoading, viewMode, onClick, className }: DoctorListItemProps) => {

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
                {viewMode === ViewMode.COMFY && <Skeleton className={x() + " h-[10px] rounded "}/>}
            </TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={y() + " h-[14px] rounded "} /></TableCell>}
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={y() + " h-[14px] rounded "} /></TableCell>}
            <TableCell><div  className={"flex flex-1 justify-end max-w-[180px]"}>
                <Skeleton className={y() + " h-[14px] rounded "}/>
                <Skeleton className={"w-[14px] h-[14px] ml-[5px] rounded "}/>
            </div>
            </TableCell>
            {viewMode === ViewMode.TABLE && <TableCell><Skeleton className={x() + " h-[10px] rounded "}/></TableCell>}
        </TableRow>);
    }
    if(!record) return <></>;
    const fullNameArr: string = record.surname + ", " + record.name;
    if(viewMode == ViewMode.LITTLE_CARDS) {
        return <div className=" border rounded-lg pr-5 overflow-hidden ">
            <TableRow selectable={false} className={"w-full" + (className??"")}>
                <TableCell className={"w-[70px] text-center rounded bg-muted"}>{ record.file }</TableCell>
                <TableCell className={"pl-4 grid" + (gridColsClass)}>
                    <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"} onClick={() => onClick(record)}>
                        {fullNameArr}{(!record.active) && <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}
                    </div>
                    <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                        <SpecialtyLink record={record.specialty} />
                    </div>
                    {(record.active) && <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                        {record.assignedUser && <UserLink showOnlyUsername={true} record={record.assignedUser} />}
                        {!record.assignedUser && "Sin usuario asociado" }
                    </div>}
                </TableCell>
            </TableRow>
        </div>;
    }
    return (<TableRow selectable={false} className={"w-full " + (className??"")}>
        <TableCell className={"w-[70px] text-center"}>{ record.file }</TableCell>
        { viewMode != ViewMode.TABLE && <TableCell className={"grid" + (gridColsClass)}>
            {(!record.active && viewMode === ViewMode.COMFY) && <div><Badge variant={"outline"} className={"ml-[-10px]"}>Deshabilitado</Badge></div>}
            <div className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"} onClick={() => onClick(record)}>
                {fullNameArr}{(!record.active && viewMode === ViewMode.COMPACT) && <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}
            </div>
            <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                <SpecialtyLink record={record.specialty} />
            </div>
            {(record.active && viewMode === ViewMode.COMFY) && <div className={"text-sm font-medium text-gray-500 truncate dark:text-white"}>
                {record.assignedUser && <UserLink showOnlyUsername={true} record={record.assignedUser} />}
                {!record.assignedUser && "Sin usuario asociado" }
            </div>}
        </TableCell>}
        {viewMode === ViewMode.TABLE && <TableCell className={"text-sm font-medium text-gray-900 truncate dark:text-white hover:underline cursor-pointer"} onClick={() => onClick(record)}>{ fullNameArr }</TableCell>}
        {viewMode === ViewMode.TABLE && <TableCell><SpecialtyLink record={record.specialty} /></TableCell>}
        <TableCell>
            <DoctorScheduleCollapsibleCell schedules={record.schedules??[]} />
        </TableCell>
        {viewMode === ViewMode.TABLE && <TableCell>{record.active ? "Habilitado" : "Deshabilitado"}</TableCell>}
    </TableRow>);
};