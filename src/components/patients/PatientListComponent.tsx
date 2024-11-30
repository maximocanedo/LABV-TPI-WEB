'use strict';

import {ViewMode} from "../buttons/ViewModeControl";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "../ui/table";
import {useCurrentUser} from "../users/CurrentUserContext";
import {Permits} from "../../entity/users";
import React from "react";
import {IPatient, PatientCommunicationView} from "../../entity/patients";
import {PatientListItem} from "./PatientListItem";

export interface PatientListComponentProps {
    viewMode: ViewMode;
    items: PatientCommunicationView[] | IPatient[];
    onClick: (record: IPatient | PatientCommunicationView) => void;
    loading: boolean;
    selectable?: boolean;
    selected?: IPatient | null;
    className?: string;
}

export const PatientListComponent = ({ viewMode, items, onClick, loading, className }: PatientListComponentProps) => {
    const { me, can } = useCurrentUser();

    const canFilterByStatus: boolean = can(Permits.DISABLE_DOCTOR);
    const whenTable: boolean = viewMode === ViewMode.TABLE;
    const elements = items.map((result: PatientCommunicationView | IPatient) =>
        <PatientListItem record={result} className={""} onClick={onClick} viewMode={viewMode} isLoading={loading} />)

    if(viewMode === ViewMode.LITTLE_CARDS) {
        return <div className="w-full flex justify-start gap-2">
            {elements}
        </div>;
    }


    return <Table className={"h-full overflow-y-visible " + (className??"")}>
        <TableHeader>
            <TableRow>
                <TableHead className={"w-[70px] text-center"}>Id</TableHead>
                <TableHead>{ whenTable && "Nombre completo" }</TableHead>
                { whenTable && <TableHead>D.N.I. N.º</TableHead> }
                {whenTable && items.length > 0 && "email" in items[0] && <TableHead>Correo electrónico</TableHead>}
                {whenTable && items.length > 0 && "phone" in items[0] && <TableHead>Número de teléfono</TableHead>}
                { (whenTable && canFilterByStatus) && <TableHead>Estado</TableHead> }
            </TableRow>
        </TableHeader>
        <TableBody>
            {elements}
            {loading && <>
                <PatientListItem record={null} onClick={x=>{}} className={"opacity-95"} isLoading={true} viewMode={viewMode} />
                <PatientListItem record={null} onClick={x=>{}} className={"opacity-80"} isLoading={true} viewMode={viewMode} />
                <PatientListItem record={null} onClick={x=>{}} className={"opacity-65"} isLoading={true} viewMode={viewMode} />
                <PatientListItem record={null} onClick={x=>{}} className={"opacity-50"} isLoading={true} viewMode={viewMode} />
                <PatientListItem record={null} onClick={x=>{}} className={"opacity-40"} isLoading={true} viewMode={viewMode} />
                <PatientListItem record={null} onClick={x=>{}} className={"opacity-30"} isLoading={true} viewMode={viewMode} />
            </>}
        </TableBody>
    </Table>;
}