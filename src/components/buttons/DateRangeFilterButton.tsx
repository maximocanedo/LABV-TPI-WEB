"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"
import {cn} from "../ui/lib/utils";
import {useEffect} from "react";

export interface DateRangeFilterButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange;
    setDate: (date: DateRange) => void;
}

export function DateRangeFilterButton(
    {
        className,
        date,
        setDate
    }: DateRangeFilterButtonProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline" size="sm" className="h-7 gap-1 max-w-full text-sm">
                        <CalendarIcon className={"h-3.5 w-3.5"} />
                        <span className="sr-only sm:not-sr-only text-xs text-nowrap whitespace-nowrap">{date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            "Elegí una fecha"
                        )}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={x => {
                            if(x) setDate(x);
                            else setDate({ from: undefined, to: undefined });
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
