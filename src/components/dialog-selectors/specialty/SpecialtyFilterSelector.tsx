'use strict';

import {Specialty} from "../../../entity/specialties";
import {Filter} from "lucide-react";
import {Button} from "../../ui/button";
import {SpecialtySelector} from "./SpecialtySelector";
import {useState} from "react";

export interface SpecialtyFilterSelectorProps {
    value: Specialty | null;
    onChange: (value: Specialty | null) => void;
    disabled?: boolean;
}

export const SpecialtyFilterSelector = ({value, onChange, disabled}: SpecialtyFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);
    return (
        <SpecialtySelector value={value} onChange={onChange} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled} variant="outline" size="sm" className="h-7 gap-1 max-w-full text-sm"><Filter className={"h-3.5 w-3.5"} />
                <span className="sr-only sm:not-sr-only text-xs text-nowrap whitespace-nowrap">{
                    value != null ? value.name : "Filtrar por especialidad"
                }</span>
            </Button>
        </SpecialtySelector>
    );
};