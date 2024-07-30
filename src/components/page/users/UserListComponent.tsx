'use strict';

import {ViewMode} from "../../buttons/ViewModeControl";
import {IUser} from "../../../entity/users";
import {UserItem} from "../../users/UserItem";
import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";

export interface UserListComponentProps {
    viewMode: ViewMode;
    items: IUser[];
    onClick: (user: IUser) => void;
    loading: boolean;
}

export const UserListComponent = ({ viewMode, items, onClick, loading }: UserListComponentProps) => {

    const elements = items.map((result: IUser) => <UserItem onClick={onClick} viewMode={viewMode} key={result.username} user={result}/>);

    return (viewMode == ViewMode.TABLE ?
        (<Table className={"h-max overflow-visible"}>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Nombre de usuario</TableHead>
                    <TableHead>Estado</TableHead>
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
        (<div className={"w-full divide-y" + (!loading && "divide-gray-200 dark:divide-gray-700")}
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