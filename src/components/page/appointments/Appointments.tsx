'use strict';

import {useCurrentUser} from "../../users/CurrentUserContext";
import {useNavigate} from "react-router";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import React, {useEffect, useReducer, useState} from "react";
import {ViewMode, ViewModeControl} from "../../buttons/ViewModeControl";
import {FilterStatus} from "../../../actions/commons";
import {useDispatchers, useListingBasicReducer} from "../../../actions/redux.utils";
import {IPatient} from "../../../entity/patients";
import * as appointments from "../../../actions/appointments";
import {AppointmentQueryCleaned} from "../../../actions/query.utils";
import {Header} from "../commons/Header";
import {PatientCommandQuery} from "../../commands/PatientCommandQuery";
import {PageContent} from "../commons/PageContent";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../ui/accordion";
import {PatientListComponent} from "../../patients/PatientListComponent";
import {resolveLocalUrl} from "../../../auth";
import {SearchPageFilterRow} from "../../containers/commons/SearchPageFilterRow";
import {StatusFilterControl} from "../../buttons/StatusFilterControl";
import {RefreshButton} from "../../buttons/commons/filterRow/RefreshButton";
import {ExportButton} from "../../buttons/commons/filterRow/ExportButton";
import {CreateButton} from "../../buttons/commons/filterRow/CreateButton";
import {Permits} from "../../../entity/users";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {PaginatorButton} from "../../buttons/commons/PaginatorButton";
import {AppointmentMinimalView, AppointmentStatus} from "../../../entity/appointments";
import {IDoctor} from "../../../entity/doctors";
import {AppointmentListComponent} from "./AppointmentListComponent";
import {AppointmentStatusFilterControl} from "../../buttons/commons/filterRow/AppointmentStatusFilterControl";
import {DoctorLittleButtonSelector} from "../../dialog-selectors/doctors/DoctorLittleButtonSelector";
import {PatientLittleButtonSelector} from "../../dialog-selectors/patients/PatientLittleButtonSelector";
import {DateRangeFilterButton} from "../../buttons/DateRangeFilterButton";
import {addDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {AppointmentCommandQuery} from "../../commands/AppointmentCommandQuery";

export interface AppointmentsProps {}

export const Appointments = ({}: AppointmentsProps) => {
    const { me } = useCurrentUser();
    const navigate = useNavigate();
    const { appointments: history } = useLocalHistory();
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);

    const [queryText, setQueryText] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [appoStatus, setAppoStatus] = useState<AppointmentStatus | null>(null);
    const [ date, setDate ] = useState<DateRange>({
        from: undefined, //new Date(2022, 0, 20),
        to: undefined // addDays(new Date(2022, 0, 20), 20),
    });
    const [ patient, setPatient ] = useState<IPatient | null>(null);
    const [ doctor, setDoctor ] = useState<IDoctor | null>(null);
    const [ showFilterSpace, setShowFilterSpace ] = useState<boolean>(true);

    const [records, dispatcher] = useReducer(useListingBasicReducer<AppointmentMinimalView>, []);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const { add, remove, prepend, clear } = useDispatchers<AppointmentMinimalView>(dispatcher);
    const getQuery = () => {
        let x = new appointments.Query(queryText)
            .filterByStatus(status);
        if(appoStatus) x = x.filterByAppointmentStatus(appoStatus);
        if(date) {
            if(date.to) x = x.filterByDateBetween(date.from?? null, date.to);
            else x = x.filterByDate(date.from?? null);
        }
        if(patient) x = x.filterByPatient(patient);
        if(doctor) x = x.filterByDoctor(doctor)
        return x.paginate(page, size);
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
    const search = (additional: AppointmentQueryCleaned = { q: queryText }) => {
        const q: AppointmentQueryCleaned = { status, ...additional };
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
    }, [queryText, status, appoStatus, doctor, patient, date]);


    return <>
        <Header>
            <AppointmentCommandQuery onSearch={search}/>
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Turnos</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {history.history.length > 0 && <div className={"w-full max-w-full"}>
                <Accordion type="single" defaultValue={"item-1"} collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Accedido recientemente</AccordionTrigger>
                        <AccordionContent>
                            { <AppointmentListComponent
                                className={" flex-wrap "}
                                viewMode={ViewMode.LITTLE_CARDS}
                                loading={false} items={history.history}
                                onClick={(x) => {
                                    navigate(resolveLocalUrl("/appointments/" + x.id));
                                }}/>  }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>}
            <SearchPageFilterRow>
                <StatusFilterControl value={status} disabled={false} onChange={setStatus}/>
                <AppointmentStatusFilterControl value={appoStatus} onChange={setAppoStatus} disabled={false} />
                <DoctorLittleButtonSelector value={doctor} onChange={setDoctor} />
                <PatientLittleButtonSelector value={patient} onChange={setPatient} />
                <DateRangeFilterButton date={date} setDate={setDate} />
                <RefreshButton loading={loading} len={records.length} handler={refresh} />
                <ExportButton handler={(): void => {}} />
                <CreateButton onClick={(): void => {
                    navigate(resolveLocalUrl("/appointments/new"))
                }} mustHave={[Permits.CREATE_APPOINTMENT]} />
            </SearchPageFilterRow>
            {records.length === 0 && !loading && <RegularErrorPage path={""} message={"No se encontraron resultados"} description={"Intentá ajustando los filtros o cambiando el texto de la consulta. "} retry={search} /> }
            {(loading || records.length > 0) &&
                <div className={"overflow-y-visible"}>
                    {<AppointmentListComponent
                        className={" overflow-visible --force-overflow-visible overflow-y-visible w-full h-full "}
                        viewMode={viewMode}
                        items={records}
                        onClick={doc => {
                            navigate(resolveLocalUrl("/appointments/" + doc.id));
                        }}
                        loading={loading}
                    />}
                </div> }
            <PaginatorButton loading={loading} len={records.length} handler={next} />
        </PageContent>
    </>;
}