'use strict';

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as users from "../../../actions/users";
import { CommonException } from "../../../entity/commons";
import { IUser, User } from "../../../entity/users";
import { Spinner } from "../../form/Spinner";
import { useLocalHistory } from "../../local/LocalHistoryContext";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import { Button } from "../../ui/button";
import { Header } from "../commons/Header";
import { PageContent } from "../commons/PageContent";
import { RegularErrorPage } from "../commons/RegularErrorPage";
import { BasicInfoCard } from "./cards/BasicInfoCard";
import { PermissionsCard } from "./cards/PermissionsCard";
import { ResetPasswordCard } from "./cards/ResetPasswordCard";
import { UpdateBasicInfoCard } from "./cards/UpdateBasicInfoCard";
import { UserStateCard } from "./cards/UserStateCard";
import { CurrentUserContext } from "./CurrentUserContext";
import { LinkedDoctorCard } from "./cards/LinkedDoctorCard";

export interface UserProfilePageProps {

}
export interface UserProfilePageParams extends Record<string, string> {
    username: string;
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const navigate = useNavigate();
    const { users: { log, history } } = useLocalHistory();
    const { username } = useParams<UserProfilePageParams>();

    const [user, setUser] = useState<IUser | User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<CommonException | null>(null);

    const refresh = () => {
        if(!username) return;
        setErr(null);
        setLoading(true);
        users.getUser(username)
            .then(user => {
                if(!user) setUser(null);
                else {
                    setUser(user);
                }
                return;
            })
            .catch(setErr)
            .finally(() => setLoading(false));
    };

    useEffect(refresh, [ username ]);

    useEffect(() => {
        if(user != null && !("error" in user)) log(user);
        console.log(history);
    }, [ user ]);

    return (<CurrentUserContext.Provider value={{ record: user, updater: setUser }}>
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
            {!loading && !!user && <div className={"masonry gap-4 p-4 sm:px-6 sm:py-0 p-0 text-sm"}>
                <BasicInfoCard />
                <ResetPasswordCard />
                <PermissionsCard />
                <UpdateBasicInfoCard />
                <LinkedDoctorCard />
                <UserStateCard  />
            </div>}
            {loading && <div className={"grid w-full h-full place-items-center"}><Spinner /></div> }
            { (!loading && !!err) && <RegularErrorPage {...err} retry={refresh} /> }
        </PageContent>
    </CurrentUserContext.Provider>);
};