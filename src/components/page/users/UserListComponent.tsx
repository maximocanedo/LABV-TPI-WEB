'use strict';

import {ViewMode} from "../../buttons/ViewModeControl";
import {IUser, Permits} from "../../../entity/users";
import {UserItem} from "../../users/UserItem";
import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {View} from "lucide-react";

export interface UserListComponentProps {
    viewMode: ViewMode;
    items: IUser[];
    onClick: (user: IUser) => void;
    loading: boolean;
    className?: string;
}

export const UserListComponent = ({ viewMode, items, onClick, loading, className }: UserListComponentProps) => {
    const { me } = useCurrentUser();
    const elements = items.map((result: IUser) => <UserItem onClick={onClick} viewMode={viewMode} key={result.username} user={result}/>);

    const canFilter: boolean = (me != null && me != "loading") && (me.access??[]).some(x => x===Permits.DELETE_OR_ENABLE_USER);

    return (viewMode == ViewMode.TABLE ?
        (<Table className={"h-max overflow-visible" + (className??"")}>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Nombre de usuario</TableHead>
                    { canFilter && <TableHead>Estado</TableHead> }
                    <TableHead>Doctor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {elements}
                {
                    loading && <>
                        <UserItem key={"loadingUserItemt"} viewMode={ViewMode.TABLE} user={null} isLoading={true} className={"opacity-95"} />
                        <UserItem key={"loadingUserItem2t"} viewMode={ViewMode.TABLE} user={null} isLoading={true} className={"opacity-85"} />
                        <UserItem key={"loadingUserItem3t"} viewMode={ViewMode.TABLE} user={null} isLoading={true} className={"opacity-75"} />
                        <UserItem key={"loadingUserItem4t"} viewMode={ViewMode.TABLE} user={null} isLoading={true} className={"opacity-65"} />
                        <UserItem key={"loadingUserItem5t"} viewMode={ViewMode.TABLE} user={null} isLoading={true} className={"opacity-55"} />
                        <UserItem key={"loadingUserItem6t"} viewMode={ViewMode.TABLE} user={null} isLoading={true} className={"opacity-50"} />
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
                    <UserItem key={"loadingUserItem"} user={null} isLoading={true} className={"opacity-95"} />
                    <UserItem key={"loadingUserItem2"} user={null} isLoading={true} className={"opacity-85"} />
                    <UserItem key={"loadingUserItem3"} user={null} isLoading={true} className={"opacity-75"} />
                    <UserItem key={"loadingUserItem4"} user={null} isLoading={true} className={"opacity-65"} />
                    <UserItem key={"loadingUserItem5"} user={null} isLoading={true} className={"opacity-55"} />
                    <UserItem key={"loadingUserItem6"} user={null} isLoading={true} className={"opacity-50"} />
                </>
            }
        </div>)
    );
}