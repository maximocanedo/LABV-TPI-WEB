'use strict';

import {useCurrentUser} from "src/components/users/CurrentUserContext";
import {Header} from "../commons/Header";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import React, {useEffect, useReducer, useState} from "react";
import {PageContent} from "../commons/PageContent";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {useNavigate} from "react-router";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {FilterStatus} from "../../../actions/commons";
import {useDispatchers, useListingBasicReducer} from "../../../actions/redux.utils";
import {PatientCommunicationView} from "../../../entity/patients";
import * as patients from "../../../actions/patients";
import {PatientQueryCleaned} from "../../../actions/query.utils";
import {PatientCommandQuery} from "../../commands/PatientCommandQuery";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../ui/accordion";
import {resolveLocalUrl} from "../../../auth";
import {PatientListComponent} from "src/components/patients/PatientListComponent";
import {SearchPageFilterRow} from "../../containers/commons/SearchPageFilterRow";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {RefreshButton} from "../../buttons/commons/filterRow/RefreshButton";
import {ExportButton} from "../../buttons/commons/filterRow/ExportButton";
import {CreateButton} from "../../buttons/commons/filterRow/CreateButton";
import {Permits} from "../../../entity/users";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {PaginatorButton} from "../../buttons/commons/PaginatorButton";

export interface PatientsMainPageProps { }

export const PatientsMainPage = ({}: PatientsMainPageProps) => {
    const { me } = useCurrentUser();
    const navigate = useNavigate();
    const { patients: history } = useLocalHistory();
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMFY);
    const [queryText, setQueryText] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [records, dispatcher] = useReducer(useListingBasicReducer<PatientCommunicationView>, []);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const { add, remove, prepend, clear } = useDispatchers<PatientCommunicationView>(dispatcher);
    const getQuery = () => {
        return new patients.Query(queryText)
            .filterByStatus(status)
            .paginate(page, size);
    };
    const execSearch = (clearAll: boolean = true) => {
        if(clearAll) clear();
        setLoading(true);
        return getQuery().search()
            .then(results => {
                results.map(add);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
                if(size != 10) setSize(10);
            });
    };
    const search = (additional: PatientQueryCleaned = { q: queryText }) => {
        const q: PatientQueryCleaned = { status, ...additional };
        setQueryText(q.q);
        if(q.status) setStatus(q.status);
        execSearch();
    };
    const next = () => {
        setPage(page + 1);
        execSearch(false);
    }
    const refresh = () => {
        setPage(1);
        setSize(records.length > 10 ? records.length : 10);
        search();
    }
    useEffect(() => {
        search();
    }, [queryText, status]);


    return <>
        <Header>
            <PatientCommandQuery onSearch={search}/>
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Pacientes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {history.history.length > 0 && <div className={"w-full max-w-full"}>
                <Accordion type="single" defaultValue={"item-1"} collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Accedido recientemente</AccordionTrigger>
                        <AccordionContent>
                            <PatientListComponent
                                className={" flex-wrap "}
                                viewMode={ViewMode.LITTLE_CARDS}
                                loading={false} items={history.history}
                                onClick={(x) => {
                                    navigate(resolveLocalUrl("/patients/" + x.id));
                                }} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>}
            <SearchPageFilterRow>
                <ViewModeControl defValue={viewMode} onChange={setViewMode}/>
                <StatusFilterControl value={status} disabled={false} onChange={setStatus}/>
                <RefreshButton loading={loading} len={records.length} handler={refresh} />
                <ExportButton records={records} />
                <CreateButton onClick={(): void => {
                    navigate(resolveLocalUrl("/patients/new"))
                }} mustHave={[Permits.CREATE_PATIENT]} />
            </SearchPageFilterRow>
            {records.length === 0 && !loading && <RegularErrorPage path={""} message={"No se encontraron resultados"} description={"Intentá ajustando los filtros o cambiando el texto de la consulta. "} retry={search} /> }
            {(loading || records.length > 0) &&
                <div className={"overflow-y-visible"}>
                    <PatientListComponent
                        className={" overflow-visible --force-overflow-visible overflow-y-visible w-full h-full "}
                        viewMode={viewMode}
                        items={records}
                        onClick={doc => {
                            navigate(resolveLocalUrl("/patients/" + doc.id));
                        }}
                        loading={loading}
                    />
                </div> }
            <PaginatorButton loading={loading} len={records.length} handler={next} />
        </PageContent>
    </>;
};