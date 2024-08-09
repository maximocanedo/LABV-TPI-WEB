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
import {UserListComponent} from "../../users/UserListComponent";
import {useNavigate} from "react-router";
import {resolveLocalUrl} from "../../../auth";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {Spinner} from "../../form/Spinner";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../ui/accordion";
import {SearchPageFilterRow} from "../../containers/commons/SearchPageFilterRow";
import {RefreshButton} from "../../buttons/commons/filterRow/RefreshButton";
import {ExportButton} from "../../buttons/commons/filterRow/ExportButton";
import {PaginatorButton} from "../../buttons/commons/PaginatorButton";

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
    const [ page, setPage ] = useState<number>(1);
    const [ size, setSize] = useState<number>(10);
    const canFilter: boolean = (me != null && me != "loading") && (me.access??[]).some(x => x===Permits.DELETE_OR_ENABLE_USER);

    const getQuery = (refresh: boolean = false): users.Query => {
        return new users.Query(q).filterByStatus(status).paginate(refresh ? 1 : page, refresh ? (results.length > size ? results.length: size) : size);
    };
    const search = (obj = {filter: null}, refresh: boolean = true) => {
        console.info({page, size});
        if(!canFilter || (!obj || !obj.filter)) {} else {
            setStatus(obj.filter);
            return;
        }
        setPage(1);
        cls();
        setLoadingState(true);
        getQuery(refresh).search()
            .then(res => {
                res.map(add);
            })
            .catch(console.error)
            .finally(() => {
                setLoadingState(false);
            });
    };

    const next = () => {
        setPage(page + 1);
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

    const refresh = () => {
        search(undefined,true);
    }


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
            <SearchPageFilterRow>
                <ViewModeControl defValue={viewMode} onChange={setViewMode}/>
                <StatusFilterControl disabled={!canFilter} value={status} onChange={setStatus}/>
                <RefreshButton len={results.length} loading={loading} handler={() => refresh()} />
                <ExportButton handler={(): void => {}} />
            </SearchPageFilterRow>
            {(loading || results.length > 0) && <div className={"overflow-visible --force-overflow-visible"}>
                    <UserListComponent viewMode={viewMode} loading={loading} items={results} onClick={(user) => {
                        navigate(resolveLocalUrl("/users/" + user.username));
                    }}/>
                </div>}
                {results.length === 0 && !loading && <RegularErrorPage path={""} message={"No se encontraron resultados"} description={"Intentá ajustando los filtros o cambiando el texto de la consulta. "} retry={search} /> }
                <PaginatorButton loading={loading} handler={next} len={results.length} />
            </PageContent>
        </>
    )
}