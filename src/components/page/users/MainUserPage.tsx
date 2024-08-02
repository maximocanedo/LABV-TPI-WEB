'use strict';

import {Header} from "../commons/Header";
import {CloudDownload, ListFilter, Plus, RefreshCcw} from "lucide-react";
import {PageContent} from "../commons/PageContent";
import * as users from "../../../actions/users";
import React, {useEffect, useReducer, useState} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "src/components/ui/breadcrumb";
import {BreadcrumbList} from "../../ui/breadcrumb";
import {FilterStatus} from "../../../actions/commons";
import {IUser, Permits} from "../../../entity/users";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {UserCommandQuery} from "../../commands/UserCommandQuery";
import {Button} from "../../ui/button";
import {Tabs} from "../../ui/tabs";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {UserListComponent} from "./UserListComponent";
import {useNavigate} from "react-router";
import {resolveLocalUrl} from "../../../auth";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {Spinner} from "../../form/Spinner";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../ui/accordion";

export interface MainUserPageProps {
}
enum resultAction {
    ADD = "ADD",
    REMOVE = "REMOVE",
    CLEAR = "CLEAR"
}
const resultsReducer = (state: IUser[], action: { type: resultAction, payload: IUser | null }): IUser[] => {
    if(!action.payload) {
        if(action.type == resultAction.CLEAR) return [];
        return [...state];
    }
    switch(action.type) {
        case resultAction.ADD:
            return [...(state.filter(x => x.username !== (action.payload as IUser).username)), action.payload];
        case resultAction.REMOVE:
            return state.filter(x => x.username !== (action.payload as IUser).username);
        default:
            return [...state];
    }
}

export const MainUserPage = (props: MainUserPageProps) => {
    const { me, setCurrentUser, loadCurrentUser } = useCurrentUser();
    const navigate = useNavigate();
    const { users: { history, rem: remove, clear }} = useLocalHistory();

    const [q, setQ] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMFY);
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [results, dispatch] = useReducer(resultsReducer, []);
    const [loading, setLoadingState] = useState<boolean>(false);

    const add = (payload: IUser) => dispatch({ type: resultAction.ADD, payload });
    const rem = (payload: IUser) => dispatch({ type: resultAction.REMOVE, payload });
    const cls = () => dispatch({ type: resultAction.CLEAR, payload: null });

    const canFilter: boolean = (me != null && me != "loading") && (me.access??[]).some(x => x===Permits.DELETE_OR_ENABLE_USER);

    const getQuery = (): users.Query => {
        return new users.Query(q).filterByStatus(status);
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


    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        search();
    };


    useEffect(() => {
        search();
    }, [status]);

    return (<>
        <Header>
            <div className="w-full flex-1">
                <UserCommandQuery q={q} onChange={setQ} onSearch={search}  />
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
                        <BreadcrumbPage>Usuarios</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {history.length > 0 && <div className={"w-full max-w-full"}>
                <Accordion type="single" defaultValue={"item-1"} collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Accedido recientemente</AccordionTrigger>
                        <AccordionContent>
                            <UserListComponent
                                className={" flex-wrap "}
                                viewMode={ViewMode.LITTLE_CARDS}
                                loading={false} items={history}
                                onClick={(user) => {
                                    navigate(resolveLocalUrl("/users/" + user.username));
                                }} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>}
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
                        <span
                            className="sr-only sm:not-sr-only text-xs">{loading ? "Cargando" : "Actualizar"}</span>
                    </Button>}
                <div className="w-full"></div>
                <Button onClick={() => {}} variant={"outline"} disabled={true} size={"sm"} className={"h-7 gap-1 text-sm"}>
                        <CloudDownload className={"h-3.5 w-3.5"} />
                        <span
                            className="sr-only sm:not-sr-only text-xs">Exportar</span>
                </Button>
            </div>
            {(loading || results.length > 0) && <div className={"overflow-visible --force-overflow-visible"}>
                    <UserListComponent viewMode={viewMode} loading={loading} items={results} onClick={(user) => {
                        navigate(resolveLocalUrl("/users/" + user.username));
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
    )
}