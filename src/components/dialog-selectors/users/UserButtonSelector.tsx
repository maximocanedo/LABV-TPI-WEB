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

export const UserButtonSelector = ({value: originalValue, onChange, disabled, className, nullable}: UserFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);
    const [ value, setValue ] = useState<IUser | null>(originalValue);
    useEffect(() => {
        onChange(value);
    }, [ value ]);
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