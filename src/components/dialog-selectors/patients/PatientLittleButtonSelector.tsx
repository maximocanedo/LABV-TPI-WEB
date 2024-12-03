'use strict';

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Specialty } from "../../../entity/specialties";
import { Button } from "../../ui/button";
import { PatientSelector } from "./PatientSelector";
import { IDoctor } from "src/entity/doctors";
import {IPatient} from "../../../entity/patients";
import {Stethoscope, UserRound} from "lucide-react";

export interface PatientFilterSelectorProps {
    value: IPatient | null;
    onChange: (value: IPatient | null) => void;
    disabled?: boolean;
    className?: string;
    nullable?: boolean;
}

export const PatientLittleButtonSelector = ({value, onChange, disabled, className, nullable}: PatientFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);

    return (
        <PatientSelector nullable={nullable?? true} value={value} onChange={x => {
            onChange(x);
        }} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled} variant="outline" size="sm" className="h-7 gap-1 max-w-full text-sm">
                <UserRound className={"h-3.5 w-3.5"} />
                <span className="sr-only sm:not-sr-only text-xs text-nowrap whitespace-nowrap">{
                    value != null ? `${value.surname}, ${value.name}` : "Paciente"
                }</span>
            </Button>
        </PatientSelector>
    );
};