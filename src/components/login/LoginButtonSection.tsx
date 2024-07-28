'use strict';

import {Button} from "../ui/button";
import {CurrentUser} from "../../App";
import {LogoutButton} from "../buttons/LogoutButton";
import {useNavigate} from "react-router";
import {Skeleton} from "../ui/skeleton";
import {LoginDialog} from "./LoginDialog";

interface LoginButtonSectionProps {
    me: CurrentUser;
    clearCurrentUser: () => void;
}

export const LoginButtonSection = ({ me, clearCurrentUser }: LoginButtonSectionProps) => {
    const navigate = useNavigate();
    if(me == "loading") return (<div className={"grid grid-cols-2 grid-rows-2 p-2 w-max gap-2"}>
        <div className="col-start-1"><Skeleton className={"h-4 w-48"} /></div>
        <div className="col-start-2 row-span-2 w-24 grid place-items-center">
            <Skeleton className={"h-8 w-16"} />
        </div>
        <div className="col-start-1"><Skeleton className={"h-4 w-36"} /></div>
    </div>);
    else if(me == null) return (<div className={"grid grid-cols-2 grid-rows-1 p-2 w-max gap-2"}>
        <LoginDialog />
        <Button onClick={() => navigate('/signup')} variant={"secondary"}>Crear cuenta</Button>
    </div>);
    else return (
            <div className={"grid grid-cols-2 grid-rows-2 p-2 w-max"}>
                <div className={"col-start-1 font-medium"}>{me.name}</div>
                <div className={"col-start-2 row-span-2 grid place-items-center"}>
                    <LogoutButton me={me} clearCurrentUser={clearCurrentUser} />
                </div>
                <div className={"text-sm text-muted-foreground md:inline"}>
                    <a href={"#"}>{"@" + me.username}</a>
                </div>
            </div>
        );
};