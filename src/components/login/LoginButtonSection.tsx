'use strict';

import {Button} from "../ui/button";
import {CurrentUser} from "../../App";
import {LogoutButton} from "../buttons/LogoutButton";
import {useNavigate} from "react-router";
import {Skeleton} from "../ui/skeleton";
import {LoginDialog} from "./LoginDialog";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import {useCurrentUser} from "../users/CurrentUserContext";

interface LoginButtonSectionProps {
}

export const LoginButtonSection = ({ }: LoginButtonSectionProps) => {
    const { me, setCurrentUser, loadCurrentUser } = useCurrentUser();
    const navigate = useNavigate();
    const cardClassList: string = "p-3 md:p-4";
    const rootClassList: string = "p-1 md:p-0 ";
    if(me == "loading") return (<Card x-chunk="dashboard-02-chunk-0" className={rootClassList}>
        <CardHeader className={cardClassList}>
            <CardTitle><Skeleton className={"h-4 w-full"} /></CardTitle>
            <CardDescription><Skeleton className={"h-4 w-3/4"} /></CardDescription>
        </CardHeader>
    </Card>);
    else if(me == null) return (<Card x-chunk="dashboard-02-chunk-0" className={rootClassList}>
        <CardHeader className={cardClassList}>
            <CardTitle>Autenticate</CardTitle>
            <CardDescription>Ingresá para administrar los turnos. </CardDescription>
        </CardHeader>
        <CardContent className="p-2 pt-0 md:p-4 md:pt-0 grid gap-3">
            <LoginDialog />
            <Button onClick={() => navigate('/signup')} variant={"secondary"}>Crear cuenta</Button>
        </CardContent>
    </Card>);
    else return (<Card x-chunk="dashboard-02-chunk-0" className={rootClassList}>
            <CardHeader className={cardClassList}>
                <CardTitle>{me.name}</CardTitle>
                <CardDescription>
                    {"@" + me.username}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                { /** <Button size="sm" className="w-full">
                 Upgrade
                 </Button>*/}
                <LogoutButton me={me} className={"w-full"} size={"sm"} clearCurrentUser={() =>setCurrentUser(null)} />
            </CardContent>
        </Card>);

        /* return (
            <div className={"grid grid-cols-2 grid-rows-2 p-2 w-max"}>
                <div className={"col-start-1 font-medium"}>{me.name}</div>
                <div className={"col-start-2 row-span-2 grid place-items-center"}>
                    <LogoutButton me={me} clearCurrentUser={clearCurrentUser} />
                </div>
                <div className={"text-sm text-muted-foreground md:inline"}>
                    <a href={"#"}>{"@" + me.username}</a>
                </div>
            </div>
        ); // */
};