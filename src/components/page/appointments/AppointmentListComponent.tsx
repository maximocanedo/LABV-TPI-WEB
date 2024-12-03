'use strict';

import React from "react";
import {AppointmentMinimalView, IAppointment} from "../../../entity/appointments";
import {AppointmentListItem} from "./AppointmentListItem";
import {ViewMode} from "../../buttons/ViewModeControl";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {Permits} from "../../../entity/users";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "../../ui/table";

export interface AppointmentListComponentProps {
    viewMode: ViewMode;
    items: AppointmentMinimalView[] | IAppointment[];
    onClick: (record: IAppointment | AppointmentMinimalView) => void;
    loading: boolean;
    selectable?: boolean;
    selected?: IAppointment | null;
    className?: string;
}

export const AppointmentListComponent = ({ viewMode, items, onClick, loading, className }: AppointmentListComponentProps) => {
    const { me, can } = useCurrentUser();

    const canFilterByStatus: boolean = can(Permits.DISABLE_DOCTOR);
    const whenTable: boolean = viewMode === ViewMode.TABLE;
    const elements = items.map((result: AppointmentMinimalView | IAppointment) =>
        <AppointmentListItem record={result} className={""} onClick={onClick} viewMode={viewMode} isLoading={loading} />)

    if(viewMode === ViewMode.LITTLE_CARDS) {
        return <div className="w-full flex justify-start gap-2">
            {elements}
        </div>;
    }


    return <Table className={"h-full overflow-y-visible " + (className??"")}>
        <TableHeader>
            <TableRow>
                <TableHead className={"w-[70px] text-center"}>Id</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha y hora</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {elements}
            {loading && <>
                <AppointmentListItem record={null} onClick={x=>{}} className={"opacity-95"} isLoading={true} viewMode={viewMode} />
                <AppointmentListItem record={null} onClick={x=>{}} className={"opacity-80"} isLoading={true} viewMode={viewMode} />
                <AppointmentListItem record={null} onClick={x=>{}} className={"opacity-65"} isLoading={true} viewMode={viewMode} />
                <AppointmentListItem record={null} onClick={x=>{}} className={"opacity-50"} isLoading={true} viewMode={viewMode} />
                <AppointmentListItem record={null} onClick={x=>{}} className={"opacity-40"} isLoading={true} viewMode={viewMode} />
                <AppointmentListItem record={null} onClick={x=>{}} className={"opacity-30"} isLoading={true} viewMode={viewMode} />
            </>}
        </TableBody>
    </Table>;
}