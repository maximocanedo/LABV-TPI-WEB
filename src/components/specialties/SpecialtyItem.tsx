'use strict';
import {Permits} from "../../entity/users";
import React, {JSXElementConstructor, ReactElement} from "react";
import {Skeleton} from "../ui/skeleton";
import {ViewMode} from "../buttons/ViewModeControl";
import {Badge} from "../ui/badge";
import {TableCell, TableRow} from "../ui/table";
import {useCurrentUser} from "./../users/CurrentUserContext";
import {Specialty} from "../../entity/specialties";

export interface SpecialtyItemProps {
    specialty: Specialty | null;
    isLoading?: boolean;
    viewMode?: ViewMode;
    onClick?: (user: Specialty) => void;
    className?: string;
}
export const SpecialtyItem = ({specialty, isLoading, viewMode, onClick, className}: SpecialtyItemProps): ReactElement<any, string | JSXElementConstructor<any>> => {
    const { me, can } = useCurrentUser();
    const c: boolean = !viewMode || viewMode === ViewMode.COMPACT;
    const canFilter: boolean = can(Permits.READ_DISABLED_SPECIALTY_RECORDS) || can(Permits.DISABLE_SPECIALTY);

    let x = () => ["w-12", "w-14", "w-16", "w-20", "w-28"][Math.floor(Math.random() * 10) % 5];
    let y = () => ["w-20", "w-28", "w-32", "w-36", "w-40"][Math.floor(Math.random() * 10) % 5] + " max-w-2/3";
    if(isLoading) {
        if(viewMode == ViewMode.TABLE) {
            return (<TableRow className={className??""}>
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
                {canFilter && <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>}
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
            </TableRow>);
        }
        return (<div className={"p-1.5 px-3 rounded w-full " + (className??"")}>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-1 min-w-0 gap-2">
                    <Skeleton className={"h-3 mb-1 " + y()} />
                    <Skeleton className={"h-3 mt-1 " + y()} />
                </div>
            </div>
        </div>);
    }
    if(specialty == null) return <></>;
    if(viewMode == ViewMode.TABLE) return (<TableRow onClick={():void=>{(onClick??((u:Specialty):void=>{}))(specialty);}} key={specialty.id + "Row"} className={(className??"")}>
        <TableCell>{specialty.id}</TableCell>
        <TableCell className="font-medium">{specialty.name}</TableCell>
        <TableCell>{specialty.description}</TableCell>
        {canFilter && <TableCell>{specialty.active ? "Habilitado" : "Deshabilitado"}</TableCell>}
    </TableRow>);
    return (
            <div onClick={():void=>{(onClick??((u:Specialty):void=>{}))(specialty);}} className={"hover:bg-muted cursor-pointer rounded w-full" + (c ? " p-1 px-1.5 " : " p-1.5 px-3 ") + (viewMode === ViewMode.LITTLE_CARDS && " border rounded-lg pr-5 ") + (className??"")}>
                <div className={"flex items-center rtl:space-x-reverse" + (c ? " space-x-2 " : " space-x-4 ")}>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{specialty.name} {!specialty.active &&
                            <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}</p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">{specialty.description}</p>
                        {
                        (!c) &&
                            <p className={"text-sm text-gray-600 truncate dark:text-gray-500"}>ID: {specialty.id}</p>
                        }
                    </div>
                </div>
            </div>)
}