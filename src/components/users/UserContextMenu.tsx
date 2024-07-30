'use strict';
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "../ui/context-menu";
import {ReactNode} from "react";
import {IUser, Permit, Permits} from "../../entity/users";
import {useCurrentUser} from "./CurrentUserContext";
import {useToast} from "../ui/use-toast";
import {resolveLocalUrl} from "../../auth";
export interface UserContextMenuProps {
    children: ReactNode;
    user: IUser;
}
export const UserContextMenu = ({children, user}: UserContextMenuProps) => {

    const { me } = useCurrentUser();
    const { toast } = useToast();
    const can = (permit: Permit | string): boolean => (!!me && me != "loading") && (me.active && (me.username == user.username) || (me.access??[]).some(action => action == permit))

    const copy = (str: string) => {
        navigator.clipboard.writeText(str)
            .then(() => {
                toast({ title: `Copiado al portapapeles. ` });
            })
            .catch(err => {
                toast({ title: `No se pudo copiar al portapapeles. ` });
            });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                { children }
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem inset>
                    Ver perfil
                </ContextMenuItem>
                <ContextMenuItem inset disabled={!can(Permits.DELETE_OR_ENABLE_USER)}>
                    Eliminar
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Copiar</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem onClick={() => {
                            copy(resolveLocalUrl('/users/' + user.username))
                        }}>Enlace al perfil</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => copy(user.username)}>Nombre de usuario</ContextMenuItem>
                        <ContextMenuItem onClick={() => copy(user.name)}>Nombre</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    )
}