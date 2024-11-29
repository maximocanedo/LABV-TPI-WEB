'use strict';

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { IUser } from "src/entity/users";
import { Button } from "../../ui/button";
import { UserSelector } from "./UserSelector";

export interface UserFilterSelectorProps {
    value: IUser | null;
    onChange: (value: IUser | null) => void;
    disabled?: boolean;
    className?: string;
    nullable?: boolean;
}
export type Setter<T> = (value: T) => void;
export type State<T> = [T, Setter<T>];

export const UserButtonSelector = ({value: originalValue, onChange, disabled, className, nullable}: UserFilterSelectorProps) => {
    const [ open, setOpen ]: State<boolean> = useState<boolean>(false);
    const [ value, setValue ]: State<IUser | null> = useState<IUser | null>(originalValue);
    // Sincronizar `value` con `originalValue` cuando este cambie
    useEffect(() => {
        if (value !== originalValue) {
            setValue(originalValue);
        }
    }, [originalValue]);

    // Notificar cambios al padre, evitando llamar si el valor no cambió
    useEffect(() => {
        if (value !== originalValue) {
            onChange(value);
        }
    }, [value]);
    return (
        <UserSelector nullable={nullable?? true} value={value} onChange={setValue} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled}
                    variant="outline"
                    role="combobox"
                    type={"button"}
                    aria-expanded={open}
                    className={"max-w-full w-full justify-between " + className?? ""}>
                <span className="sr-only sm:not-sr-only text-nowrap whitespace-nowrap">{
                    value != null ? value.name : "Seleccione un usuario"
                }</span>
                <div className="w-full"></div>
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </UserSelector>
    );
};