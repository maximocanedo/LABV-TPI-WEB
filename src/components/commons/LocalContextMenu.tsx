'use strict';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger
} from "../ui/context-menu";
import {LocalContextMenuProps} from "../patients/PatientContextMenu";
import {LocalContextMenuItem} from "./LocalContextMenuItem";

export const LocalContextMenu = ({children, items}: LocalContextMenuProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                { children }
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                {
                    items.map(option => (
                        ("submenu" in option && option.submenu !== undefined) ? (
                            <ContextMenuSub key={option.label}>
                                <ContextMenuSubTrigger inset>{option.label}</ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                    {option.submenu.map(subOption => (
                                        <LocalContextMenuItem {...subOption} />
                                    ))}
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                        ) : (<LocalContextMenuItem {...option} />)
                    ))
                }
            </ContextMenuContent>
        </ContextMenu>
    )
}
