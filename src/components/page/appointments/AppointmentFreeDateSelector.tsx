'use strict';

import {IdentifiableDoctor, IDoctor} from "../../../entity/doctors";
import {useEffect, useReducer} from "react";
import * as appointments from "../../../actions/appointments";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel} from "src/components/ui/select";
import {SelectTrigger} from "../../ui/select";
import {Spinner} from "../../form/Spinner";
import {CalendarDays} from "lucide-react";

export interface AppointmentFreeDateSelectorProps {
    doctor: IdentifiableDoctor | IDoctor | undefined;
    value: Date | undefined;
    onChange: (value: Date | undefined) => null;
    disabled?: boolean;
}
const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: 'numeric',
    month: 'long'
};
export const printDate = (date: Date) => date.toLocaleDateString('es-AR', options);
export const printDateWithTime = (date: Date) => date.toLocaleDateString('es-AR', options);
type State = {
    list: Date[];
    loading: boolean;
    selectedDate: Date | undefined;
};
type Action =
    | { type: "RESET" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_DATES"; payload: Date[] }
    | { type: "SET_SELECTED_DATE"; payload: Date | undefined };
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "RESET":
            return { list: [], loading: false, selectedDate: undefined };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_DATES":
            return { ...state, list: action.payload, loading: false };
        case "SET_SELECTED_DATE":
            return { ...state, selectedDate: action.payload };
        default:
            return state;
    }
};
export const AppointmentFreeDateSelector
    = ({ doctor, value, onChange, disabled }: AppointmentFreeDateSelectorProps) => {
    const [state, dispatch] = useReducer(reducer, {
        list: [],
        loading: true,
        selectedDate: value,
    });
    useEffect((): void => {
        dispatch({ type: "RESET" });
        if (!doctor) return;
        const fetchDates = async (): Promise<void> => {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                let currentDate: Date = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                const dates: (Date | string)[] = await appointments.getAvailableDates(doctor.file, currentDate);
                const parsedDates: Date[] = dates
                    .map((dateStr: string | Date): Date | null => {
                        const parsedDate: Date = new Date(dateStr);
                        return isNaN(parsedDate.getTime()) ? null : parsedDate;
                    })
                    .filter(Boolean) as Date[];
                // if(parsedDates.length > 0) dispatch({ type: "SET_SELECTED_DATE", payload: parsedDates[0] });
                dispatch({ type: "SET_DATES", payload: parsedDates });
            } catch (error) {
                console.error("Error fetching available dates: ", error);
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };
        fetchDates();
    }, [doctor]);

    useEffect((): void => {
        if(state.selectedDate != value) onChange(state.selectedDate);
    }, [state.selectedDate, onChange]);

    useEffect((): void => {
        if(state.selectedDate != value) dispatch({type: "SET_SELECTED_DATE", payload: value});
    }, [value, onChange]);

    useEffect((): void => {
        if(state.list.length == 0) {
            onChange(undefined);
            dispatch({ type: "RESET" });
        }
    }, [ state.list.length ]);

    return (
        <Select
            disabled={ (disabled?? false) || state.loading || state.list.length === 0 }
            onValueChange={(valueStr: string): void => {
                const selectedDate: Date = new Date(valueStr);
                dispatch({
                    type: "SET_SELECTED_DATE",
                    payload: isNaN(selectedDate.getTime()) ? undefined : selectedDate,
                });
            }}
        >
            <SelectTrigger className="w-full">
                <div className={"max-w-full w-full flex justify-start h-full items-center"}>
                    {state.loading
                        ? <Spinner
                            className={"w-[16px] h-[16px] ml-1 mr-3"}/>
                        : <CalendarDays className={"w-[16px] h-[16px] ml-1 mr-3"}/>
                    }
                    <span
                        className=" text-nowrap whitespace-nowrap overflow-hidden text-ellipsis text-start max-w-full w-[80%]">
                                {state.loading
                                    ? "Buscando fechas disponibles"
                                    : (
                                        state.list.length == 0
                                            ? "No hay fechas disponibles"
                                            : (
                                                (state.selectedDate !== undefined)
                                                    ? printDate(state.selectedDate)
                                                    : "Seleccione una fecha"
                                            )
                                    )}
                            </span>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fechas disponibles</SelectLabel>
                    {state.list.length > 0 && state.list.map(date => (
                        <SelectItem value={date.toISOString()} key={date.toISOString()}>
                            {printDate(date)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};