'use strict';

import {Header} from "../commons/Header";
import {Search} from "lucide-react";
import {Input} from "../../ui/input";
import {PageContent} from "../commons/PageContent";
import * as users from "../../../actions/users";
import React, {useReducer, useState} from "react";
import {CurrentUser} from "../../../App";
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
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {UserItem} from "../../users/UserItem";
import {useCurrentUser} from "../../users/CurrentUserContext";

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
            return [...state, action.payload];
        case resultAction.REMOVE:
            return state.filter(x => x.username !== (action.payload as IUser).username);
        default:
            return [...state];
    }
}

export const MainUserPage = (props: MainUserPageProps) => {
    const { me, setCurrentUser, loadCurrentUser } = useCurrentUser();

    const [q, setQ] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [results, dispatch] = useReducer(resultsReducer, []);

    const add = (payload: IUser) => dispatch({ type: resultAction.ADD, payload });
    const rem = (payload: IUser) => dispatch({ type: resultAction.REMOVE, payload });
    const cls = () => dispatch({ type: resultAction.CLEAR, payload: null });

    const getQuery = (): users.Query => {
        return new users.Query(q).filterByStatus(status);
    };

    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        cls();
        getQuery().search()
            .then(res => {
                res.map(add);
            }).catch(console.error);
        console.log({q, status});
    };

    return (<>
        <Header>
            <div className="w-full flex-1">
                <form action={"#"} onSubmit={onSearch}>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="Buscar usuarios..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        />
                    </div>
                </form>
            </div>
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Usuarios</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-3 grid-rows-5 gap-3" x-chunk="dashboard-02-chunk-1">
                {
                    results.map(result => <UserItem user={result} />)
                }
            </div>
        </PageContent>
    </>)
}