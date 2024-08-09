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
import {Tabs} from "../../ui/tabs";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {Button} from "../../ui/button";
import {CloudDownload, RefreshCcw} from "lucide-react";
import {Spinner} from "../../form/Spinner";
import {WeekdayControl} from "../../buttons/WeekdayControl";
import {SpecialtySelector} from "../../dialog-selectors/specialty/SpecialtySelector";
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

export interface MainDoctorsPageProps {

}

export const MainDoctorsPage = (props: MainDoctorsPageProps) => {
    const navigate = useNavigate();
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
            <div className="w-full flex-1">
                <DoctorCommandQuery onSearch={search}/>
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
                        <BreadcrumbPage>Médicos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <SearchPageFilterRow>
                <ViewModeControl defValue={viewMode} onChange={setViewMode}/>
                <StatusFilterControl value={status} disabled={false} onChange={setStatus}/>
                <WeekdayControl value={day} disabled={false} onChange={setDay} />
                <SpecialtyFilterSelector value={specialty} onChange={setSpecialty} />
                <RefreshButton loading={loading} len={records.length} handler={refresh} />
                <ExportButton handler={(): void => {}} />
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