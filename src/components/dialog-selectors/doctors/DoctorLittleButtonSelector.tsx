'use strict';

import { CaretSortIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Specialty } from "../../../entity/specialties";
import { Button } from "../../ui/button";
import { DoctorSelector } from "./DoctorSelector";
import { IDoctor } from "src/entity/doctors";
import {ListFilter, Stethoscope, UserRound} from "lucide-react";

export interface SpecialtyFilterSelectorProps {
    value: IDoctor | null;
    onChange: (value: IDoctor | null) => void;
    disabled?: boolean;
    className?: string;
    nullable?: boolean;
    specialty?: Specialty | null;
    filterByUnassigned?: boolean;
}

export const DoctorLittleButtonSelector = ({value, onChange, disabled, className, nullable, specialty, filterByUnassigned }: SpecialtyFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);

    return (
        <DoctorSelector unassigned={filterByUnassigned?? false} specialty={specialty} nullable={nullable?? true} value={value} onChange={x => {
            onChange(x);
        }} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled} variant="outline" size="sm" className="h-7 gap-1 max-w-full text-sm">
                <Stethoscope className={"h-3.5 w-3.5"} />
                <span className="sr-only sm:not-sr-only text-xs text-nowrap whitespace-nowrap">{
                    value != null ? `${value.surname}, ${value.name}` : "Médico"
                }</span>
            </Button>
        </DoctorSelector>
    );
};