'use strict';

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Specialty } from "../../../entity/specialties";
import { Button } from "../../ui/button";
import { PatientSelector } from "./PatientSelector";
import { IDoctor } from "src/entity/doctors";
import {IPatient} from "../../../entity/patients";
import {UserRound} from "lucide-react";

export interface PatientFilterSelectorProps {
    value: IPatient | null;
    onChange: (value: IPatient | null) => void;
    disabled?: boolean;
    className?: string;
    nullable?: boolean;
}

export const PatientButtonSelector = ({value, onChange, disabled, className, nullable}: PatientFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);

    return (
        <PatientSelector nullable={nullable?? true} value={value} onChange={x => {
            if(!(nullable?? true)) onChange(x);
        }} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled}
                    variant="outline"
                    role="combobox"
                    type={"button"}
                    aria-expanded={open}
                    className={"max-w-full w-full justify-between " + className?? ""}>
                <UserRound className={"mr-2 h-[16px] w-[16px] min-h-[16px] min-w-[16px] "}/>
                <span className=" text-nowrap whitespace-nowrap overflow-hidden text-ellipsis text-start max-w-full w-[80%]">{
                    value != null ? `${value.surname}, ${value.name}` : "Seleccione un paciente"
                }</span>
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PatientSelector>
    );
};