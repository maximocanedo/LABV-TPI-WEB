'use strict';


import {Button} from "../ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import React, {useEffect} from "react";
import {cn} from "../ui/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "../ui/calendar";
import { format } from "date-fns"
import { Input } from "../ui/input";

export interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const DatePicker = ({ value, onChange, disabled }: DatePickerProps) => {

    const [date, setDatei] = React.useState<Date | undefined>(value);
    const setDate = (d: Date | undefined) => {
        if(d) d.setHours(16);
        setDatei(d);
    };
    useEffect(() => {
        onChange(date);
        console.log(date);
    }, [ date ]);


    return (<Popover>
        <PopoverTrigger asChild>
            <Button
                disabled={disabled?? false}
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Seleccione una fecha</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
            <div className={"w-full grid place-items-center p-2 pt-4 pb-0"}>
                <Input
                    disabled={disabled??false} className={"w-auto max-w-fit min-w-12"} type={"number"} value={date?.getFullYear()} onChange={(e) => {
                    let year = 0;
                    if(e.target.value.trim().length) year = e.target.valueAsNumber;
                    let d = new Date(date?? new Date());
                    d.setHours(12);
                    d.setUTCFullYear(year);

                    setDate(d);
                }} />
            </div>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                month={date}
                disabled={disabled??false}
                onMonthChange={setDate}
            />
        </PopoverContent>
    </Popover>)
}