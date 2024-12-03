'use strict';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../../../ui/dropdown-menu";
import {Button} from "../../../ui/button";
import {ListFilter} from "lucide-react";
import {AppointmentStatus} from "../../../../entity/appointments";

export interface AppointmentStatusFilterControlProps {
    value: AppointmentStatus | null;
    disabled: boolean;
    onChange: (value: AppointmentStatus | null) => void;
}
export const AppointmentStatusFilterControl = ({value, onChange: oc, disabled }: AppointmentStatusFilterControlProps) => {

    const onChange = (value: AppointmentStatus): void => {
        if(disabled) oc(null);
        else oc(value);
    };

    const opt: Record<AppointmentStatus, string> = {
        "PENDING": "Pendientes",
        "CANCELLED": "Cancelados",
        "ABSENT": "Ausentes",
        "PRESENT": "Presentes"
    };

    const label: string = !value ? "Situación" : opt[value];

    if(disabled) return <></>;
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button disabled={disabled} variant="outline" size="sm" className="h-7 gap-1 max-w-full text-sm"><ListFilter className={"h-3.5 w-3.5"} />
                <span className="sr-only sm:not-sr-only text-xs text-nowrap whitespace-nowrap">{label}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Situación</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
                checked={value == "PENDING"}
                onCheckedChange={checked => (checked && onChange("PENDING"))}>
                Pendientes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "ABSENT"}
                onCheckedChange={checked => (checked && onChange("ABSENT"))}>
                Ausentes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "PRESENT"}
                onCheckedChange={checked => (checked && onChange("PRESENT"))}>
                Presentes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "CANCELLED"}
                onCheckedChange={checked => (checked && onChange("CANCELLED"))}>
                Cancelados
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>)
};