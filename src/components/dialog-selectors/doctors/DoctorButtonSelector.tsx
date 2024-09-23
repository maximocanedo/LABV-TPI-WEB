'use strict';

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Specialty } from "../../../entity/specialties";
import { Button } from "../../ui/button";
import { DoctorSelector } from "./DoctorSelector";
import { IDoctor } from "src/entity/doctors";

export interface SpecialtyFilterSelectorProps {
    value: IDoctor | null;
    onChange: (value: IDoctor | null) => void;
    disabled?: boolean;
    className?: string;
    nullable?: boolean;
}

export const DoctorButtonSelector = ({value: originalValue, onChange, disabled, className, nullable}: SpecialtyFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);
    const [ value, setValue ] = useState<IDoctor | null>(originalValue);
    useEffect(() => {
        onChange(value);
    }, [ value ]);
    return (
        <DoctorSelector nullable={nullable?? true} value={value} onChange={x => {
            if(!(nullable?? true)) setValue(x);
        }} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled}
                    variant="outline"
                    role="combobox"
                    type={"button"}
                    aria-expanded={open}
                    className={"max-w-full w-full justify-between " + className?? ""}>
                <span className="sr-only sm:not-sr-only text-nowrap whitespace-nowrap">{
                    value != null ? value.name : "Seleccione un médico"
                }</span>
                <div className="w-full"></div>
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </DoctorSelector>
    );
};