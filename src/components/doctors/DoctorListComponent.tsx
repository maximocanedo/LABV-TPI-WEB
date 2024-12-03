'use strict';

import {ViewMode} from "../buttons/ViewModeControl";
import {DoctorMinimalView, IDoctor} from "../../entity/doctors";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "../ui/table";
import {useCurrentUser} from "../users/CurrentUserContext";
import {Permits} from "../../entity/users";
import React from "react";
import {DoctorListItem} from "./DoctorListItem";

export interface DoctorListComponentProps {
    viewMode: ViewMode;
    items: DoctorMinimalView[];
    onClick: (record: IDoctor | DoctorMinimalView) => void;
    loading: boolean;
    selectable?: boolean;
    selected?: IDoctor | null;
    className?: string;
    selector?: boolean;
    vertical?: boolean;
}

export const DoctorListComponent = ({ viewMode, items, onClick, loading, className, selector, vertical }: DoctorListComponentProps) => {
    const { me, can } = useCurrentUser();

    const canFilterByStatus: boolean = can(Permits.DISABLE_DOCTOR);
    const whenTable: boolean = viewMode === ViewMode.TABLE;
    const elements = items.map((result: DoctorMinimalView) =>
        <DoctorListItem selector={selector?? false} record={result} className={""} onClick={onClick} viewMode={viewMode} isLoading={loading} />)

    if(viewMode === ViewMode.LITTLE_CARDS) {
        return <div className={"w-full flex " + ((vertical ?? false)?"flex-col":"") +  " justify-start gap-2"}>
            {elements}
        </div>;
    }


    return <Table className={"h-full overflow-y-visible " + (className??"")}>
        <TableHeader>
            <TableRow>
                <TableHead className={"w-[70px] text-center"}>Legajo</TableHead>
                <TableHead>{ whenTable && "Nombre completo" }</TableHead>
                { whenTable && <TableHead>Especialidad</TableHead> }
                {!selector && <TableHead>Horarios</TableHead>}
                { (whenTable && canFilterByStatus) && <TableHead>Estado</TableHead> }
            </TableRow>
        </TableHeader>
        <TableBody>
            {elements}
            {loading && <>
                <DoctorListItem record={null} onClick={x=>{}} className={"opacity-95"} isLoading={true} viewMode={viewMode} />
                <DoctorListItem record={null} onClick={x=>{}} className={"opacity-80"} isLoading={true} viewMode={viewMode} />
                <DoctorListItem record={null} onClick={x=>{}} className={"opacity-65"} isLoading={true} viewMode={viewMode} />
                <DoctorListItem record={null} onClick={x=>{}} className={"opacity-50"} isLoading={true} viewMode={viewMode} />
                <DoctorListItem record={null} onClick={x=>{}} className={"opacity-40"} isLoading={true} viewMode={viewMode} />
                <DoctorListItem record={null} onClick={x=>{}} className={"opacity-30"} isLoading={true} viewMode={viewMode} />
            </>}
        </TableBody>
    </Table>;
}