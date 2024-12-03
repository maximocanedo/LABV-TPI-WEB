"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "../../ui/button"
import { Calendar } from "../../ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../ui/popover"
import {cn} from "../../ui/lib/utils";
export interface DatePickerWithRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    date: DateRange;
    disabled?: boolean;
    onChange: (date: DateRange) => void;
}
export function DatePickerWithRange({ date, onChange: setDate, className, disabled }: DatePickerWithRangeProps) {


    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        disabled={disabled?? false}
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon width={16} height={16} className={"mr-2"}  />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(x) => {
                            if(x) setDate(x);
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
