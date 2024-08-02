'use strict';

import {Header} from "../commons/Header";
import {UserCommandQuery} from "../../commands/UserCommandQuery";
import React, {useEffect, useReducer, useState} from "react";
import {PageContent} from "../commons/PageContent";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import {Tabs} from "../../ui/tabs";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {FilterStatus} from "../../../actions/commons";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {IUser, Permits} from "../../../entity/users";
import {SpecialtyCommandQuery} from "../../commands/SpecialtyCommandQuery";
import * as specialties from "../../../actions/specialties";
import {Specialty} from "../../../entity/specialties";
import {Button} from "../../ui/button";
import {CloudDownload, Plus, RefreshCcw} from "lucide-react";
import {Spinner} from "../../form/Spinner";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {resolveLocalUrl} from "../../../auth";
import {UserListComponent} from "../../users/UserListComponent";
import { useNavigate } from "react-router-dom";
import {SpecialtyListComponent} from "./SpecialtyListComponent";

export interface MainSpecialtyPageProps {

}

enum resultAction {
    ADD = "ADD",
    REMOVE = "REMOVE",
    CLEAR = "CLEAR"
}
const resultsReducer = (state: Specialty[], action: { type: resultAction, payload: Specialty | null }): Specialty[] => {
    if(!action.payload) {
        if(action.type == resultAction.CLEAR) return [];
        return [...state];
    }
    switch(action.type) {
        case resultAction.ADD:
            return [...(state.filter(x => x.id !== (action.payload as Specialty).id)), action.payload];
        case resultAction.REMOVE:
            return state.filter(x => x.id !== (action.payload as Specialty).id);
        default:
            return [...state];
    }
}

export const MainSpecialtyPage = (props: MainSpecialtyPageProps) => {
    const { me, can } = useCurrentUser();
    const navigate = useNavigate();
    const [ query, setQuery ] = useState<string>("");
    const [ viewMode, setViewMode ] = useState<ViewMode>(ViewMode.COMFY);
    const [ status, setStatus ] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [results, dispatch] = useReducer(resultsReducer, []);

    const add = (payload: Specialty) => dispatch({ type: resultAction.ADD, payload });
    const rem = (payload: Specialty) => dispatch({ type: resultAction.REMOVE, payload });
    const cls = () => dispatch({ type: resultAction.CLEAR, payload: null });

    const canFilter: boolean = can(Permits.READ_DISABLED_SPECIALTY_RECORDS) || can(Permits.ENABLE_SPECIALTY);

    const getQuery = (): specialties.Query => {
        return new specialties.Query(query).filterByStatus(status);
    };
    const search = (obj = {filter: null}) => {
        if(!canFilter || (!obj || !obj.filter)) {} else {
            setStatus(obj.filter);
            return;
        }
        cls();
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

    return (<>
        <Header>
            <div className="w-full flex-1">
                <SpecialtyCommandQuery onSearch={search} onChange={setQuery} q={query} />
            </div>
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Especialidades</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-between gap-2 w-full">
                <Tabs defaultValue="COMFY" className="w-[250px]">
                    <ViewModeControl onChange={setViewMode}/>
                </Tabs>
                <StatusFilterControl disabled={!canFilter} value={status} onChange={setStatus}/>
                {(loading || results.length > 0) &&
                    <Button onClick={() => search()} disabled={loading} variant="outline" size="sm"
                            className="h-7 gap-1 text-sm">
                        {!loading && <RefreshCcw className={"h-3.5 w-3.5"}/>}
                        {loading && <Spinner className={"h-3.5 w-3.5"}/>}
                        <span className="sr-only sm:not-sr-only text-xs">{loading ? "Cargando" : "Actualizar"}</span>
                    </Button>}
                <div className="w-full"></div>
                <Button onClick={() => {}} variant={"outline"} disabled={true} size={"sm"} className={"h-7 gap-1 text-sm"}>
                    <CloudDownload className={"h-3.5 w-3.5"}/>
                    <span className="sr-only sm:not-sr-only text-xs">Exportar</span>
                </Button>
            </div>
            {(loading || results.length > 0) && <div className={"overflow-visible --force-overflow-visible"}>
                <SpecialtyListComponent viewMode={viewMode} loading={loading} items={results} onClick={(specialty) => {
                    navigate(resolveLocalUrl("/specialties/" + specialty.id));
                }}/>
            </div>}
            {results.length === 0 && !loading && <RegularErrorPage path={""} message={"No se encontraron resultados"} description={"Intentá ajustando los filtros o cambiando el texto de la consulta. "} retry={search} /> }
            {
                !loading && results.length > 0 && <div>
                    <Button variant={"outline"} onClick={next}><Plus className={"mr-2"}/>Cargar más</Button>
                </div>
            }
        </PageContent>
        </>
    );
};