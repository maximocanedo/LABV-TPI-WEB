'use strict';

import {ViewMode} from "../../buttons/ViewModeControl";
import {IUser, Permits} from "../../../entity/users";
import {UserItem} from "../../users/UserItem";
import React from "react";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {Specialty} from "../../../entity/specialties";
import {SpecialtyItem} from "../../specialties/SpecialtyItem";

export interface SpecialtyListComponentProps {
    viewMode: ViewMode;
    items: Specialty[];
    onClick: (specialty: Specialty) => void;
    loading: boolean;
    className?: string;
}

export const SpecialtyListComponent = ({ viewMode, items, onClick, loading, className }: SpecialtyListComponentProps) => {
    const { me, can } = useCurrentUser();
    const elements = items.map((result: Specialty) => <SpecialtyItem onClick={onClick} viewMode={viewMode} key={"specialtyItem$" + result.id} specialty={result}/>);

    const canFilter: boolean = can(Permits.READ_DISABLED_SPECIALTY_RECORDS) || can(Permits.DISABLE_SPECIALTY);

    return (viewMode == ViewMode.TABLE ?
        (<Table className={"h-max overflow-visible" + (className??"")}>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    { canFilter && <TableHead>Estado</TableHead> }
                </TableRow>
            </TableHeader>
            <TableBody>
                {elements}
                {
                    loading && <>
                        <SpecialtyItem key={"loadingSpecialtyItemt"} viewMode={ViewMode.TABLE} specialty={null} isLoading={true} className={"opacity-95"} />
                        <SpecialtyItem key={"loadingSpecialtyItem2t"} viewMode={ViewMode.TABLE} specialty={null} isLoading={true} className={"opacity-85"} />
                        <SpecialtyItem key={"loadingSpecialtyItem3t"} viewMode={ViewMode.TABLE} specialty={null} isLoading={true} className={"opacity-75"} />
                        <SpecialtyItem key={"loadingSpecialtyItem4t"} viewMode={ViewMode.TABLE} specialty={null} isLoading={true} className={"opacity-65"} />
                        <SpecialtyItem key={"loadingSpecialtyItem5t"} viewMode={ViewMode.TABLE} specialty={null} isLoading={true} className={"opacity-55"} />
                        <SpecialtyItem key={"loadingSpecialtyItem6t"} viewMode={ViewMode.TABLE} specialty={null} isLoading={true} className={"opacity-50"} />
                    </>
                }
            </TableBody>
        </Table>)
            :
            (<div className={(viewMode === ViewMode.LITTLE_CARDS ? "w-full flex justify-start gap-2" : "w-full divide-y" + (!loading && "divide-gray-200 dark:divide-gray-700")) + (className??"")}
              x-chunk="dashboard-02-chunk-1">
            {elements}
            {
                loading && <>
                    <SpecialtyItem key={"loadingSpecialtyItem"} specialty={null} isLoading={true} className={"opacity-95"} />
                    <SpecialtyItem key={"loadingSpecialtyItem2"} specialty={null} isLoading={true} className={"opacity-85"} />
                    <SpecialtyItem key={"loadingSpecialtyItem3"} specialty={null} isLoading={true} className={"opacity-75"} />
                    <SpecialtyItem key={"loadingSpecialtyItem4"} specialty={null} isLoading={true} className={"opacity-65"} />
                    <SpecialtyItem key={"loadingSpecialtyItem5"} specialty={null} isLoading={true} className={"opacity-55"} />
                    <SpecialtyItem key={"loadingSpecialtyItem6"} specialty={null} isLoading={true} className={"opacity-50"} />
                </>
            }
        </div>)
    );
}