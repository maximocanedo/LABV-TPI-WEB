'use strict';

import {Header} from "../commons/Header";
import {PageContent} from "../commons/PageContent";
import {UserCommandQuery} from "../../commands/UserCommandQuery";
import React, {useEffect, useState} from "react";
import {Button} from "../../ui/button";
import {ArrowLeft} from "lucide-react";
import {useNavigate, useParams} from "react-router";
import {IUser, User} from "../../../entity/users";
import * as users from "../../../actions/users";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import {Card, CardContent, CardHeader} from "../../ui/card";
import {BasicInfoCard} from "./cards/BasicInfoCard";
import {PermissionsCard} from "./cards/PermissionsCard";
import {UpdateBasicInfoCard} from "./cards/UpdateBasicInfoCard";
import {UserStateCard} from "./cards/UserStateCard";
import {ResetPasswordCard} from "./cards/ResetPasswordCard";

export interface UserProfilePageProps {

}
export interface UserProfilePageParams extends Record<string, string> {
    username: string;
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const navigate = useNavigate();
    const { username } = useParams<UserProfilePageParams>();

    const [user, setUser] = useState<IUser | User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const refresh = () => {
        if(!username) return;
        setLoading(true);
        users.getUser(username)
            .then(user => {
                if(!user) setUser(null);
                else setUser(user);
                return;
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(refresh, [ username ]);

    return (<>
        <Header>
            <div className="w-full flex-1">
                <Button onClick={() => {navigate(-1)}} variant={"ghost"} className={"flex-1"}><ArrowLeft className={"mr-3 w-4 h-4"}/><span
                    className={"text-sm"}>Volver</span></Button>
            </div>
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/users">Usuarios</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{(!user || loading) ? `Usuario @${username}` : `${user.name} (@${user.username})`}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"masonry gap-4 p-4 sm:px-6 sm:py-0 p-0 text-sm"}>
                { !loading && !!user && <BasicInfoCard user={user} /> }
                { !loading && !!user && <ResetPasswordCard user={user} /> }
                { !loading && !!user && <PermissionsCard user={user} /> }
                { !loading && !!user && <UpdateBasicInfoCard user={user} onUpdate={(updated) => {setUser({...user, ...updated});}} /> }
                { !loading && !!user && <UserStateCard user={user} onUpdate={(state: boolean) => {setUser({ ...user, active: state });}} /> }
            </div>
        </PageContent>
    </>);
};