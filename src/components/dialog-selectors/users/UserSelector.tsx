'use strict';
import {Specialty} from "../../../entity/specialties";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger} from "../../ui/dialog";
import {DoctorCommandQuery} from "../../commands/DoctorCommandQuery";
import {SpecialtyCommandQuery} from "../../commands/SpecialtyCommandQuery";
import React, {useEffect, useReducer, useState} from "react";
import {useDispatchers, useListingBasicReducer, useUserListingBasicReducer} from "../../../actions/redux.utils";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {IUser, Permits} from "../../../entity/users";
import * as users from "../../../actions/users";
import {FilterStatus} from "../../../actions/commons";
import {Tabs} from "../../ui/tabs";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {Button} from "../../ui/button";
import {CloudDownload, RefreshCcw} from "lucide-react";
import {Spinner} from "../../form/Spinner";
import {SpecialtyListComponent} from "../../page/specialties/SpecialtyListComponent";
import {resolveLocalUrl} from "../../../auth";
import {ScrollArea} from "../../ui/scroll-area";
import { UserListComponent } from "src/components/users/UserListComponent";

/**
 * Componente diálogo de selector de especialidades. NO incluye el trigger.
 */

export interface UserSelectorProps {
    value: IUser | null;
    onChange: (value: IUser | null) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    nullable?: boolean;
}

export const UserSelector = ({ value, onChange, open, onOpenChange, children, nullable }: UserSelectorProps) => {
    const { me, can } = useCurrentUser();
    const [selected, setSelected] = useState<IUser | null>(value);
    const [ query, setQuery ] = useState<string>("");
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [ results, dispatchResults ] = useReducer(useUserListingBasicReducer, []);
    const { add, clear, prepend } = useDispatchers<IUser>(dispatchResults);


    useEffect(() => {
        setSelected(value);
    }, [ value ]);

    useEffect(() => {
        onChange(selected);
    }, [ selected ]);

    const canFilter: boolean = can(Permits.READ_DISABLED_SPECIALTY_RECORDS) || can(Permits.ENABLE_SPECIALTY);
    const getQuery = (): users.Query => {
        return new users.Query(query).filterByStatus(status).filterByUnassigned(true);
    };
    const search = (obj = {filter: null}) => {
        if(!canFilter || (!obj || !obj.filter)) {} else {
            setStatus(obj.filter);
            return;
        }
        clear();
        setLoadingState(true);
        getQuery().search()
            .then(res => {
                res.map(add);
            })
            .catch(console.error)
            .finally(() => {
                setLoadingState(false);
            });
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
    }, [status]);

    return (<Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild={true}>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="w-full">
                <SpecialtyCommandQuery onSearch={search} className=" w-full pr-8 " q={query} onChange={setQuery} />
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
                    <UserListComponent selectable={true} selected={selected} className={"w-full h-full"} viewMode={ViewMode.COMFY} loading={loading} items={results} onClick={(user) => {
                        if(value != null && value.username === user.username && (nullable??true)) setSelected(null);
                        else {
                            setSelected(user);
                            prepend(user);
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