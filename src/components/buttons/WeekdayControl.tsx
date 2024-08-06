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
import {CalendarDays, Filter, ListFilter} from "lucide-react";
import {weekday} from "../../entity/doctors";

export interface WeekdayControlProps {
    value: weekday | null;
    disabled: boolean;
    onChange: (value: weekday | null) => void;
}
const spanishNamesForWeekdays: Record<weekday, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo"
};
export const WeekdayControl = ({value, onChange: oc, disabled }: WeekdayControlProps) => {

    const onChange = (value: weekday | null): void => {
        if(disabled) oc(null);
        else oc(value);
    };

    const label = value != null ? spanishNamesForWeekdays[value] : "Filtrar por día";
    if(disabled) return <></>;
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button disabled={disabled} variant="outline" size="sm" className="h-7 gap-1 max-w-full text-sm"><CalendarDays className={"h-3.5 w-3.5"} />
                <span className="sr-only sm:not-sr-only text-xs text-nowrap whitespace-nowrap">{label}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">

            { !!value &&
                <DropdownMenuCheckboxItem
                    checked={!value}
                    onCheckedChange={checked => (checked && onChange(null))}>
                    No filtrar
                </DropdownMenuCheckboxItem> }
            { !!value && <DropdownMenuSeparator /> }
            <DropdownMenuCheckboxItem
                checked={value == "MONDAY"}
                onCheckedChange={checked => (checked && onChange("MONDAY"))}>
                Lunes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "TUESDAY"}
                onCheckedChange={checked => (checked && onChange("TUESDAY"))}>
                Martes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "WEDNESDAY"}
                onCheckedChange={checked => (checked && onChange("WEDNESDAY"))}>
                Miércoles
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "THURSDAY"}
                onCheckedChange={checked => (checked && onChange("THURSDAY"))}>
                Jueves
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "FRIDAY"}
                onCheckedChange={checked => (checked && onChange("FRIDAY"))}>
                Viernes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "SATURDAY"}
                onCheckedChange={checked => (checked && onChange("SATURDAY"))}>
                Sábado
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                checked={value == "SUNDAY"}
                onCheckedChange={checked => (checked && onChange("SUNDAY"))}>
                Domingo
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>)
};