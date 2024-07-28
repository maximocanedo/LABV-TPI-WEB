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
import {Button, buttonVariants} from "../ui/button";
import * as users from "../../actions/users";
import { useToast } from "../ui/use-toast";


export interface LogoutButtonProps {
    me: CurrentUser;
    clearCurrentUser: () => void;
}
export const LogoutButton = ({ me: user, clearCurrentUser }: LogoutButtonProps) => {

    const { toast } = useToast();

    if(user == "loading" || user == null) {
        return (<Button variant={"destructive"} disabled><s>Cerrar sesión</s></Button>);
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
        <AlertDialogTrigger className={buttonVariants({ variant: "destructive" })}>
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