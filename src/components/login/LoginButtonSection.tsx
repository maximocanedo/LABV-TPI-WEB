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
    return (<Card x-chunk="dashboard-02-chunk-0" className={rootClassList}>
        <CardHeader className={cardClassList}>
            <CardTitle>{!me ? "Autenticate" : (me == "loading" ? <Skeleton className={"h-4 w-full"} /> : me.name)}</CardTitle>
            <CardDescription>
                {!me ? "Ingresá para administrar los turnos. " : (me == "loading" ? <Skeleton className={"h-4 w-3/4"} /> : "@" + me.username)}
            </CardDescription>
        </CardHeader>
        {me != "loading" && <CardContent className={!me ? "p-2 pt-0 md:p-4 md:pt-0 grid gap-3" : "p-2 pt-0 md:p-4 md:pt-0"}>
            {!!me && <LogoutButton className={"w-full"} size={"sm"} />}
            {!me && (<>
                <LoginDialog />
                <Button onClick={() => navigate('/signup')} variant={"secondary"}>Crear cuenta</Button>
            </>)}
        </CardContent>}
    </Card>);
};