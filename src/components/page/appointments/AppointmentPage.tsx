'use strict';

import { useCurrentUser } from "src/components/users/CurrentUserContext";
import {extractNumbers} from "../specialties/SpecialtyPage";
import {useParams} from "react-router";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import * as data from "../../../actions/appointments";
import {CommonException} from "../../../entity/commons";
import React, {useEffect, useState} from "react";
import {Header} from "../commons/Header";
import {DefBackButton} from "../../buttons/DefBackButton";
import { PageContent } from "../commons/PageContent";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import { CardContainer } from "src/components/containers/commons/CardContainer";
import { Skeleton } from "src/components/ui/skeleton";
import {Appointment, IAppointment} from "../../../entity/appointments";
import {CurrentAppointmentContext} from "./CurrentAppointmentContext";
import {printDate} from "./AppointmentFreeDateSelector";
import {LinkedDoctorCard} from "./cards/LinkedDoctorCard";
import {LinkedPatientCard} from "./cards/LinkedPatientCard";
import {BasicInfoCard} from "./cards/BasicInfoCard";
import { CloseCard } from "./cards/CloseCard";
import {AbsentCard} from "./cards/AbsentCard";
import {CancelledCard} from "./cards/CancelledCard";
import {StateCard} from "./cards/StateCard";

export interface AppointmentPageProps {}
export interface AppointmentPageParams extends Record<string, string> {
    id: string;
}
const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    day: 'numeric',
    month: 'short'
};
export const printDateWithTime = (date: Date) => date.toLocaleDateString('es-AR', options);
export const AppointmentPage = ({}: AppointmentPageProps) => {
    const { id: rawId } = useParams<AppointmentPageParams>();
    const { appointments } = useLocalHistory()
    const { me } = useCurrentUser();
    const id: number = extractNumbers(rawId);
    const [ record, setRecord ]
        = useState<IAppointment | Appointment | null>(null);
    const [ err, setErr ]
        = useState<CommonException | null>(null);
    const [ loading, setLoading ]
        = useState<boolean>(true);

    useEffect(() => {
        if(record != null && !("error" in record)) appointments.log(record);
    }, [ record ]);

    const refresh = () => {
        if(!id) return;
        setErr(null);
        setLoading(true);
        data.findById(id)
            .then((record: IAppointment) => {
                if(!record) setRecord(null);
                else setRecord(record);
                return;
            })
            .catch(setErr)
            .finally(() => setLoading(false));
    };
    useEffect(refresh, [id]);


    return (<CurrentAppointmentContext.Provider value={{record, updater: setRecord}}>
        <Header>
            <DefBackButton />
        </Header>
        <PageContent>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/appointments">Turnos</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{(!record || loading) ? `${id > -1 ? `Turno #${id}` : ""}` : `Turno #${id} con el dr. ${(record.assignedDoctor?.surname?? (" leg. n.º " + record.assignedDoctor?.file)) + " el " + printDateWithTime(new Date(record.date))}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CardContainer>
            {record && !loading && <>
                <BasicInfoCard />
                <CloseCard />
                <AbsentCard />
                <CancelledCard />
                <LinkedDoctorCard />
                <LinkedPatientCard />
                <StateCard />
            </>}
            {loading && <>
                <Skeleton className={"card h-24"} />
                <Skeleton className={"card h-36"} />
                <Skeleton className={"card h-32"} />
                <Skeleton className={"card h-52"} />
                <Skeleton className={"card h-48"} />
                <Skeleton className={"card h-24"} />
                <Skeleton className={"card h-36"} />
            </>}
            </CardContainer>
        </PageContent>
    </CurrentAppointmentContext.Provider>)
};