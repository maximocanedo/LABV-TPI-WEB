'use strict';
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useReducer, useState } from "react";
import { FilterStatus } from "../../../actions/commons";
import { useDispatchers, useListingBasicReducer } from "../../../actions/redux.utils";
import * as doctors from "../../../actions/doctors";
import { Permits } from "../../../entity/users";
import { StatusFilterControl } from "../../buttons/StatusFilterControl";
import { ViewMode } from "../../buttons/ViewModeControl";
import { Spinner } from "../../form/Spinner";
import { DoctorListComponent } from "../../doctors/DoctorListComponent";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../ui/dialog";
import { useCurrentUser } from "../../users/CurrentUserContext";
import { IDoctor, weekday } from "src/entity/doctors";
import { DoctorCommandQuery } from "src/components/commands/DoctorCommandQuery";
import { DoctorQueryCleaned } from "src/actions/query.utils";
import { Specialty } from "src/entity/specialties";

/**
 * Componente diálogo de selector de especialidades. NO incluye el trigger.
 */

export interface DoctorSelectorProps {
    value: IDoctor | null;
    onChange: (value: IDoctor | null) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    nullable?: boolean;
}

export const DoctorSelector = ({ value, onChange, open, onOpenChange, children, nullable }: DoctorSelectorProps) => {
    const { me, can } = useCurrentUser();
    const [selected, setSelected] = useState<IDoctor | null>(value);
    const [ query, setQuery ] = useState<string>("");
    const [day, setDay] = useState<weekday | null>(null);
    const [checkUnassigned, setCheckUnassigned] = useState<boolean>(false);
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [ results, dispatchResults ] = useReducer(useListingBasicReducer<IDoctor>, []);
    const { add, clear, prepend } = useDispatchers<IDoctor>(dispatchResults);


    useEffect(() => {
        setSelected(value);
    }, [ value ]);

    useEffect(() => {
        onChange(selected);
    }, [ selected ]);

    const canFilter: boolean = can(Permits.DISABLE_DOCTOR) || can(Permits.ENABLE_DOCTOR);
    const getQuery = (): doctors.Query => {
        let x = new doctors.Query(query).filterByStatus(status);
        x.filterByUnassigned(true);
        return x;
    };
    
    const execSearch = (clearAll: boolean = true) => {
        if(clearAll) clear();
        setLoadingState(true);
        return getQuery().search()
            .then(results => {
                results.map(add);
            })
            .catch(console.error)
            .finally(() => {
                setLoadingState(false);
            });
    };
    // @ts-nocheck
    const search = (additional: DoctorQueryCleaned = { q: query }) => {
        const q: DoctorQueryCleaned = { status, day, unassigned: checkUnassigned, ...additional };
        setQuery(q.q);
        if(q.status) setStatus(q.status);
        if(q.day) setDay(q.day);
        if(q.unassigned) setCheckUnassigned(q.unassigned);
        execSearch();
        console.log(q);
    };
    const next = () => {
        setLoadingState(true);
        getQuery().next()
            .then(res => {
                res.map(add);
            })
            .catch(console.error)
            .finally(() => {
                setLoadingState(false);
            });
    };
    useEffect(() => {
        search();
    }, [status, query, day]);

    return (<Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild={true}>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="w-full">
                <DoctorCommandQuery onSearch={search} className=" w-full pr-8 " />
            </DialogHeader>
            <div className={"w-full grid place-items-center flex-wrap"}>
                <div className="flex justify-between gap-2 w-full">
                    <StatusFilterControl disabled={!canFilter} value={status} onChange={setStatus}/>
                    {(loading || results.length > 0) &&
                        <Button onClick={() => search()} disabled={loading} variant="outline" size="sm"
                                className="h-7 gap-1 text-sm">
                            {!loading && <RefreshCcw className={"h-3.5 w-3.5"}/>}
                            {loading && <Spinner className={"h-3.5 w-3.5"}/>}
                            <span className="sr-only sm:not-sr-only text-xs">{loading ? "Cargando" : "Actualizar"}</span>
                        </Button>}
                    <div className="w-full"></div>
                </div>
                {(loading || results.length > 0) && <div className={"pt-4 w-full h-fit h-[300px] overflow-y-scroll max-h-[300px]"}>
                    <DoctorListComponent selectable={true} selected={selected} className={"w-full h-full"} viewMode={ViewMode.COMFY} loading={loading} items={results} onClick={(specialty) => {
                        if(value != null && value.id === specialty.id && (nullable??true)) setSelected(null);
                        else {
                            setSelected(specialty);
                            prepend(specialty);
                            onOpenChange(false);
                            // setOpen(false);
                        }
                    }}/>
                </div>}
                {(!loading && results.length === 0) && <div className={"grid"}>

                </div>}
            </div>
            <DialogFooter>

            </DialogFooter>
        </DialogContent>
    </Dialog>);
}