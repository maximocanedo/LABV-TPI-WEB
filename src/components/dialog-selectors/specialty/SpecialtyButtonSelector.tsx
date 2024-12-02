'use strict';

import {Specialty} from "../../../entity/specialties";
import {BriefcaseMedical, Filter, Stethoscope} from "lucide-react";
import {Button} from "../../ui/button";
import {SpecialtySelector} from "./SpecialtySelector";
import {useEffect, useState} from "react";
import {CaretSortIcon} from "@radix-ui/react-icons";

export interface SpecialtyFilterSelectorProps {
    value: Specialty | null;
    onChange: (value: Specialty | null) => void;
    disabled?: boolean;
    className?: string;
    nullable?: boolean;
}

export const SpecialtyButtonSelector = ({value, onChange: setValue, disabled, className, nullable}: SpecialtyFilterSelectorProps) => {
    const [ open, setOpen ] = useState<boolean>(false);

    return (
        <SpecialtySelector nullable={nullable?? true} value={value} onChange={x => {
            if(!(nullable?? true)) setValue(x);
        }} open={open} onOpenChange={setOpen}>
            <Button disabled={disabled}
                    variant="outline"
                    role="combobox"
                    type={"button"}
                    aria-expanded={open}
                    className={"max-w-full w-full justify-between " + className?? ""}>
                <BriefcaseMedical className={"mr-2 h-[16px] w-[16px] min-h-[16px] min-w-[16px] "}/>
                <span className=" text-nowrap whitespace-nowrap overflow-hidden text-ellipsis text-start max-w-full w-[80%]">{
                    value != null ? value.name : "Seleccione una especialidad"
                }</span>
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </SpecialtySelector>
    );
};