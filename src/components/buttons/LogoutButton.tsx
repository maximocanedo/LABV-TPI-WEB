'use strict';
import {CurrentUser} from "../../App";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import {Button, ButtonProps, buttonVariants} from "../ui/button";
import * as users from "../../actions/users";
import { useToast } from "../ui/use-toast";
import React from "react";
import {useCurrentUser} from "../users/CurrentUserContext";


export interface LogoutButtonProps extends ButtonProps, React.RefAttributes<HTMLButtonElement> {
}
export const LogoutButton = ({ className, ...props }: LogoutButtonProps) => {

    const { toast } = useToast();
    const { me: user, setCurrentUser, loadCurrentUser } = useCurrentUser();
    const clearCurrentUser = () => setCurrentUser(null);
    if(user == "loading" || user == null) {
        return (<Button variant={"outline"} disabled><s>Cerrar sesión</s></Button>);
    }

    const logout = () => {
        users.logout();
        clearCurrentUser();
        document.body.dispatchEvent(new Event("user-logged-out", {}));
        toast({
            title: "¡Nos vemos!",
            description: "La sesión fue cerrada. "
        })
    };

    return (
    <AlertDialog>
        <AlertDialogTrigger { ...props } className={className + " " + buttonVariants({ variant: "outline" })}>
            Cerrar sesión
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Estás a punto de cerrar sesión</AlertDialogTitle>
                <AlertDialogDescription>
                    ¿Seguro de continuar, {user.name}?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Volver</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Cerrar sesión</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )
};