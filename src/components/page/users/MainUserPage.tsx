'use strict';

import {Header} from "../commons/Header";
import {Plus} from "lucide-react";
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
import {IUser} from "../../../entity/users";
import {useCurrentUser} from "../../users/CurrentUserContext";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {UserCommandQuery} from "../../commands/UserCommandQuery";
import {Button} from "../../ui/button";
import {Tabs} from "../../ui/tabs";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {UserListComponent} from "./UserListComponent";
import {useNavigate} from "react-router";
import {resolveLocalUrl} from "../../../auth";

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
    const [q, setQ] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMFY);
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [results, dispatch] = useReducer(resultsReducer, []);
    const [loading, setLoadingState] = useState<boolean>(false);

    const add = (payload: IUser) => dispatch({ type: resultAction.ADD, payload });
    const rem = (payload: IUser) => dispatch({ type: resultAction.REMOVE, payload });
    const cls = () => dispatch({ type: resultAction.CLEAR, payload: null });

    const getQuery = (): users.Query => {
        return new users.Query(q).filterByStatus(status);
    };
    const search = (obj = {filter: null}) => {
        if(!obj || !obj.filter) {} else {
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
        console.log(users.permitDocs);

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
                <Tabs defaultValue="COMFY" className="w-[400px]">
                    <div className="flex justify-start gap-2">
                        <ViewModeControl onChange={setViewMode}/>
                        <StatusFilterControl value={status} onChange={setStatus}/>
                    </div>
                </Tabs>
                <div className={"overflow-visible --force-overflow-visible"}>
                    <UserListComponent viewMode={viewMode} loading={loading} items={results} onClick={(user) => {
                        navigate(resolveLocalUrl("/users/" + user.username));
                    }} />
                </div>
                {
                    !loading && <div>
                        <Button variant={"outline"} onClick={next}><Plus className={"mr-2"}/>Cargar más</Button>
                    </div>
                }
            </PageContent>
        </>
    )
}