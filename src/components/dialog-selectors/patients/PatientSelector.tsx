'use strict';
import {RefreshCcw} from "lucide-react";
import React, {useEffect, useReducer, useState} from "react";
import {FilterStatus} from "../../../actions/commons";
import {useDispatchers, useListingBasicReducer} from "../../../actions/redux.utils";
import * as patients from "../../../actions/patients";
import {Permits} from "../../../entity/users";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {ViewMode} from "../../buttons/ViewModeControl";
import {Spinner} from "../../form/Spinner";
import {Button} from "../../ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "../../ui/dialog";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {DoctorCommandQuery} from "src/components/commands/DoctorCommandQuery";
import {PatientQueryCleaned} from "src/actions/query.utils";
import {IPatient} from "../../../entity/patients";
import {PatientListComponent} from "../../patients/PatientListComponent";
import {PaginatorButton} from "../../buttons/commons/PaginatorButton";
import {PatientCommandQuery} from "../../commands/PatientCommandQuery";

/**
 * Componente diálogo de selector de especialidades. NO incluye el trigger.
 */

export interface PatientSelectorProps {
    value: IPatient | null;
    onChange: (value: IPatient | null) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    nullable?: boolean;
}

export const PatientSelector = ({ value, onChange, open, onOpenChange, children, nullable }: PatientSelectorProps) => {
    const { can } = useCurrentUser();
    const [selected, setSelected] = useState<IPatient | null>(value);
    const [ query, setQuery ] = useState<string>("");
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [ results, dispatchResults ] = useReducer(useListingBasicReducer<IPatient>, []);
    const { add, clear, prepend } = useDispatchers<IPatient>(dispatchResults);


    useEffect(() => {
        if(value != selected) setSelected(value);
    }, [ value ]);

    useEffect(() => {
        if(selected != value) onChange(selected);
    }, [ selected ]);

    const canFilter: boolean = can(Permits.DISABLE_PATIENT) || can(Permits.ENABLE_PATIENT);

    const getQuery = (): patients.Query => new patients.Query(query).filterByStatus(status);
    
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
    const search = (additional: PatientQueryCleaned = { q: query }) => {
        const q: PatientQueryCleaned = { status, ...additional };
        setQuery(q.q);
        if(q.status) setStatus(q.status);
        execSearch();
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
    }, [status, query]);

    return (<Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild={true}>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="w-full">
                <PatientCommandQuery onSearch={search} className=" w-full pr-8 " />
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
                {(loading || results.length > 0) && <div className={"pt-4 w-full h-[300px] overflow-y-scroll max-h-[300px]"}>
                    <PatientListComponent
                        selectable={true}
                        selected={selected}
                        className={"w-full h-full"}
                        viewMode={ViewMode.COMFY}
                        loading={loading}
                        items={results}
                        onClick={(record) => {
                        if(value != null && value.id === record.id && (nullable??true)) setSelected(null);
                        else {
                            setSelected(record);
                            prepend(record);
                            onOpenChange(false);
                        }
                        console.log({record});
                    }}/>
                    <PaginatorButton loading={loading} len={results.length} handler={next} />
                </div>}
                {(!loading && results.length === 0) && <div className={"grid"}>

                </div>}
            </div>
            <DialogFooter>

            </DialogFooter>
        </DialogContent>
    </Dialog>);
}