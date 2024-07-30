'use strict';
import {FilterStatus} from "../../actions/commons";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import {Filter, ListFilter} from "lucide-react";

export interface StatusFilterControlProps {
    value: FilterStatus;
    onChange: (value: FilterStatus) => void;
}
export const StatusFilterControl = ({value, onChange}: StatusFilterControlProps) => {


    const label = value == FilterStatus.ONLY_ACTIVE ? "Sólo registros activos" : (value == FilterStatus.ONLY_INACTIVE ? "Sólo registros inactivos" : "Todos los registros");

    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-sm"><ListFilter className={"h-3.5 w-3.5"} />
                <span className="sr-only sm:not-sr-only text-xs">{label}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
                checked={value == FilterStatus.ONLY_ACTIVE}
                onCheckedChange={checked => (checked && onChange(FilterStatus.ONLY_ACTIVE))}>
                Sólo activos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == FilterStatus.ONLY_INACTIVE}
                onCheckedChange={checked => (checked && onChange(FilterStatus.ONLY_INACTIVE))}>
                Sólo inactivos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == FilterStatus.BOTH}
                onCheckedChange={checked => checked && onChange(FilterStatus.BOTH)}>
                Todos los registros
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>)
};