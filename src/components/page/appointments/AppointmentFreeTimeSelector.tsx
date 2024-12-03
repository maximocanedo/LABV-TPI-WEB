'use strict';

import {IdentifiableDoctor, IDoctor} from "../../../entity/doctors";
import {useEffect, useReducer} from "react";
import * as appointments from "../../../actions/appointments";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue} from "src/components/ui/select";
import {SelectTrigger} from "../../ui/select";
import {Spinner} from "../../form/Spinner";
import {CalendarDays, Clock} from "lucide-react";

export interface AppointmentFreeTimeSelectorProps {
    doctor: IdentifiableDoctor | IDoctor | undefined;
    date: Date | undefined;
    value: string | undefined;
    onChange: (value: string | undefined) => null;
    disabled?: boolean;
}
type State = {
    list: string[];
    loading: boolean;
    selectedHour: string | undefined;
};
type Action =
    | { type: "RESET" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_TIMES"; payload: string[] }
    | { type: "SET_SELECTED_TIME"; payload: string | undefined };
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "RESET":
            return { list: [], loading: false, selectedHour: undefined };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_TIMES":
            return { ...state, list: action.payload, loading: false };
        case "SET_SELECTED_TIME":
            return { ...state, selectedHour: action.payload };
        default:
            return state;
    }
};
export const AppointmentFreeTimeSelector
    = ({ doctor, date, value, onChange, disabled }: AppointmentFreeTimeSelectorProps) => {
    const [state, dispatch] = useReducer(reducer, {
        list: [],
        loading: true,
        selectedHour: value
    });
    const fetchDates = async (): Promise<void> => {
        if (!doctor || !date) return;
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const dates: string[] = await appointments.getAvailableSchedules(doctor.file, date);
            //if(dates.length > 0) dispatch({ type: "SET_SELECTED_TIME", payload: dates[0] });
            dispatch({ type: "SET_TIMES", payload: dates });
        } catch (error) {
            console.error("Error fetching available dates: ", error);
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };
    useEffect((): void => {
        dispatch({ type: "RESET" });
        fetchDates();
    }, [doctor, date]);

    useEffect((): void => {
        onChange(state.selectedHour);
    }, [state.selectedHour, onChange]);

    useEffect((): void => {
        if((state.list??[]).length == 0) {
            onChange(undefined);
            dispatch({ type: "RESET" });
        }
    }, [ (state.list??[]).length ]);

    return (
        <Select
            disabled={ (disabled?? false) || state.loading || (state.list??[]).length === 0 }
            onValueChange={(valueStr: string): void => {
                dispatch({
                    type: "SET_SELECTED_TIME",
                    payload: valueStr,
                });
            }}
        >
            <SelectTrigger className="w-full">
                <div className={"max-w-full w-full flex justify-start h-full items-center"}>
                    {state.loading
                        ? <Spinner
                            className={"w-[16px] h-[16px] ml-1 mr-3"}/>
                        : <Clock className={"w-[16px] h-[16px] ml-1 mr-3"}/>
                    }
                    <span
                        className=" text-nowrap whitespace-nowrap overflow-hidden text-ellipsis text-start max-w-full w-[80%]">
                        {
                            state.loading
                                ? "Buscando horarios disponibles"
                                : (
                                    (state.list??[]).length == 0
                                        ? "No hay horarios disponibles"
                                        : (
                                            (state.selectedHour !== undefined)
                                                ? (state.selectedHour)
                                                : "Seleccione una hora"
                                        )
                                )
                        }
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Horarios disponibles</SelectLabel>
                    {(state.list??[]).length > 0 && state.list.map(schedule => (
                        <SelectItem value={schedule?? ""} key={schedule}>
                            {schedule}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};