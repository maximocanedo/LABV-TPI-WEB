'use strict';
// TODO: Implementar link de médico cuando esté disponible.

import {IUser} from "../../entity/users";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import React, {JSXElementConstructor, ReactElement} from "react";
import {UserContextMenu} from "./UserContextMenu";
import { Avatar } from "@radix-ui/react-avatar";
import {AvatarFallback} from "../ui/avatar";
import {Skeleton} from "../ui/skeleton";
import {ViewMode} from "../buttons/ViewModeControl";
import {Badge} from "../ui/badge";
import {TableCell, TableRow} from "../ui/table";

export interface UserItemProps {
    user: IUser | null;
    isLoading?: boolean;
    viewMode?: ViewMode;
    onClick?: (user: IUser) => void;
    className?: string;
}
export const UserItem = ({user, isLoading, viewMode, onClick, className}: UserItemProps): ReactElement<any, string | JSXElementConstructor<any>> => {
    const c: boolean = !viewMode || viewMode === ViewMode.COMPACT;
    let x = () => ["w-12", "w-14", "w-16", "w-20", "w-28"][Math.floor(Math.random() * 10) % 5];
    let y = () => ["w-20", "w-28", "w-32", "w-36", "w-40"][Math.floor(Math.random() * 10) % 5] + " max-w-2/3";
    if(isLoading) {
        if(viewMode == ViewMode.TABLE) {
            return (<TableRow className={className??""}>
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
                <TableCell><Skeleton className={"h-3 " + x() } /></TableCell>
            </TableRow>);
        }
        return (<div className={"p-1.5 px-3 rounded w-full " + (className??"")}>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                    <Skeleton className={"w-8 h-8 rounded-full"} />
                </div>
                <div className="flex-1 min-w-0 gap-2">
                    <Skeleton className={"h-3 mb-1 " + y()} />
                    <Skeleton className={"h-3 mt-1 " + y()} />
                </div>
            </div>
        </div>);
    }
    if(user == null) return <></>;
    if(viewMode == ViewMode.TABLE) return (<TableRow onClick={():void=>{(onClick??((u:IUser):void=>{}))(user);}} key={user.username + "Row"} className={(className??"")}>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.active ? "Habilitado" : "Deshabilitado"}</TableCell>
        <TableCell>{user.doctor ? user.doctor.surname + ", " + user.doctor.name : "Sin doctor vinculado"}</TableCell>
    </TableRow>);
    return (<UserContextMenu user={user}>
            <div onClick={():void=>{(onClick??((u:IUser):void=>{}))(user);}} className={"hover:bg-muted cursor-pointer rounded w-full" + (c ? " p-1 px-1.5 " : " p-1.5 px-3 ") + (className??"")}>
                <div className={"flex items-center rtl:space-x-reverse" + (c ? " space-x-2 " : " space-x-4 ")}>
                    <div className="flex-shrink-0">
                        <Avatar>
                            <AvatarFallback className={"w-8 h-8 rounded-full"}>{user.name.trim()[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{user.name} {!user.active &&
                            <Badge variant={"outline"} className={"ml-2"}>Deshabilitado</Badge>}</p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">@{user.username}</p>
                        {
                            (!c && user.doctor) &&
                            <p className={"text-sm text-gray-600 truncate dark:text-gray-500"}>Doctor: {user.doctor.surname}, {user.doctor.name}</p>
                        }
                    </div>
                    {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    $320
                </div>*/}
                </div>
            </div>
    </UserContextMenu>)
}