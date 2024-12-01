'use strict';
import {LocalContextMenuProps} from "../patients/PatientContextMenu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {LocalMenuItem} from "./LocalMenuItem";

export const LocalMenu = ({children, items}: LocalContextMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                { children }
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                {
                    items.map(option => (
                        ("submenu" in option && option.submenu !== undefined) ? (
                            <DropdownMenuSub key={option.label}>
                                <DropdownMenuSubTrigger inset>{option.label}</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        {option.submenu.map(subOption => (
                                            <LocalMenuItem {...subOption} />
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        ) : (<LocalMenuItem {...option} />)
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
