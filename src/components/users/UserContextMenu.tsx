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
export interface UserContextMenuProps {
    children: ReactNode;
    user: IUser;
}
export const UserContextMenu = ({children, user}: UserContextMenuProps) => {

    const { me } = useCurrentUser();
    const can = (permit: Permit | string): boolean => (!!me && me != "loading") && (me.active && (me.username == user.username) || (me.access??[]).some(action => action == permit))



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
                        <ContextMenuItem>Enlace al perfil</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem>Nombre de usuario</ContextMenuItem>
                        <ContextMenuItem>Nombre</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    )
}