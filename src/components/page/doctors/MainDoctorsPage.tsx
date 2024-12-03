'use strict';

import {Header} from "../commons/Header";
import {PageContent} from "../commons/PageContent";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import * as doctors from "../../../actions/doctors";
import React, {useEffect, useReducer, useState} from "react";
import {DoctorCommandQuery} from "../../commands/DoctorCommandQuery";
import {DoctorQueryCleaned} from "../../../actions/query.utils";
import {FilterStatus} from "../../../actions/commons";
import {DoctorMinimalView, weekday} from "../../../entity/doctors";
import {Specialty} from "../../../entity/specialties";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {WeekdayControl} from "../../buttons/WeekdayControl";
import {SpecialtyFilterSelector} from "../../dialog-selectors/specialty/SpecialtyFilterSelector";
import {DoctorListComponent} from "../../doctors/DoctorListComponent";
import {useDispatchers, useListingBasicReducer} from "../../../actions/redux.utils";
import {SearchPageFilterRow} from "../../containers/commons/SearchPageFilterRow";
import {RefreshButton} from "../../buttons/commons/filterRow/RefreshButton";
import {ExportButton} from "../../buttons/commons/filterRow/ExportButton";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {PaginatorButton} from "../../buttons/commons/PaginatorButton";
import {useNavigate} from "react-router";
import {resolveLocalUrl} from "../../../auth";
import {useLocalHistory} from "src/components/local/LocalHistoryContext";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "src/components/ui/accordion";
import {Permits} from "src/entity/users";
import {CreateButton} from "../../buttons/commons/filterRow/CreateButton";

export interface MainDoctorsPageProps {

}

export const MainDoctorsPage = (props: MainDoctorsPageProps) => {
    const navigate = useNavigate();
    const { doctors: { clear: historyClear, rem, log, history } } = useLocalHistory();
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMFY);
    const [queryText, setQueryText] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [day, setDay] = useState<weekday | null>(null);
    const [checkUnassigned, setCheckUnassigned] = useState<boolean>(false);
    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [records, dispatcher] = useReducer(useListingBasicReducer<DoctorMinimalView>, []);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const { add, remove, prepend, clear } = useDispatchers<DoctorMinimalView>(dispatcher);
    const getQuery = () => {
        return new doctors.Query(queryText)
            .filterByDay(day?? "")
            .filterBySpecialty(specialty)
            .filterByUnassigned(checkUnassigned)
            .filterByStatus(status)
            .paginate(page, size);
    }

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
    // @ts-nocheck
    const search = (additional: DoctorQueryCleaned = { q: queryText }) => {
        const q: DoctorQueryCleaned = { status, day, unassigned: checkUnassigned, ...additional };
        setQueryText(q.q);
        if(q.status) setStatus(q.status);
        if(q.day) setDay(q.day);
        if(q.unassigned) setCheckUnassigned(q.unassigned);
        execSearch();
        console.log(q);
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
    }, [queryText, day, status, checkUnassigned, specialty]);

    return (<>
        <Header>
            <DoctorCommandQuery onSearch={search}/>
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Médicos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {history.length > 0 && <div className={"w-full max-w-full"}>
                <Accordion type="single" defaultValue={"item-1"} collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Accedido recientemente</AccordionTrigger>
                        <AccordionContent>
                            <DoctorListComponent
                                className={" flex-wrap "}
                                viewMode={ViewMode.LITTLE_CARDS}
                                loading={false} items={history}
                                onClick={(x) => {
                                    navigate(resolveLocalUrl("/doctors/" + x.file));
                                }} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>}
            <SearchPageFilterRow>
                <ViewModeControl defValue={viewMode} onChange={setViewMode}/>
                <StatusFilterControl value={status} disabled={false} onChange={setStatus}/>
                <WeekdayControl value={day} disabled={false} onChange={setDay} />
                <SpecialtyFilterSelector value={specialty} onChange={setSpecialty} />
                <RefreshButton loading={loading} len={records.length} handler={refresh} />
                <ExportButton records={records} />
                <CreateButton onClick={(): void => {
                    navigate(resolveLocalUrl("/doctors/new"))
                }} mustHave={[Permits.CREATE_DOCTOR]} />
            </SearchPageFilterRow>
            {records.length === 0 && !loading && <RegularErrorPage path={""} message={"No se encontraron resultados"} description={"Intentá ajustando los filtros o cambiando el texto de la consulta. "} retry={search} /> }
            {(loading || records.length > 0) &&
                <div className={"overflow-y-visible"}>
                    <DoctorListComponent
                        className={" overflow-visible --force-overflow-visible overflow-y-visible w-full h-full "}
                        viewMode={viewMode}
                        items={records}
                        onClick={doc => {
                            navigate(resolveLocalUrl("/doctors/" + doc.file));
                        }}
                        loading={loading}
                    />
                </div> }
            <PaginatorButton loading={loading} len={records.length} handler={next} />
        </PageContent>
    </>);
};