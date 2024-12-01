'use strict';

import { useCurrentUser } from "src/components/users/CurrentUserContext";
import {extractNumbers} from "../specialties/SpecialtyPage";
import {useParams} from "react-router";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import * as data from "../../../actions/patients";
import {CommonException} from "../../../entity/commons";
import React, {useEffect, useState} from "react";
import {IPatient, Patient} from "src/entity/patients";
import { CurrentPatientContext } from "./CurrentPatientContext";
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
import {BasicInfoCard} from "./cards/BasicInfoCard";
import {CommunicationInfoCard} from "./cards/CommunicationInfoCard";
import {PrivateInfoCard} from "./cards/PrivateInfoCard";
import { StateCard } from "./cards/StateCard";
import { Skeleton } from "src/components/ui/skeleton";

export interface PatientPageProps {}
export interface PatientPageParams extends Record<string, string> {
    id: string;
}
export const PatientPage = ({}: PatientPageProps) => {
    const { id: rawId } = useParams<PatientPageParams>();
    const { patients } = useLocalHistory()
    const { me } = useCurrentUser();
    const id: number = extractNumbers(rawId);
    const [ record, setRecord ]
        = useState<IPatient | Patient | null>(null);
    const [ err, setErr ]
        = useState<CommonException | null>(null);
    const [ loading, setLoading ]
        = useState<boolean>(true);

    useEffect(() => {
        if(record != null) patients.log(record);
    }, [ record ]);

    const refresh = () => {
        if(!id) return;
        setErr(null);
        setLoading(true);
        data.findById(id)
            .then((record: IPatient) => {
                if(!record) setRecord(null);
                else setRecord(record);
                return;
            })
            .catch(setErr)
            .finally(() => setLoading(false));
    };
    useEffect(refresh, [id]);


    return (<CurrentPatientContext.Provider value={{record, updater: setRecord}}>
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
                        <BreadcrumbLink href="/patients">Pacientes</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{(!record || false || loading) ? `${id > -1 ? `Paciente N.º ${id}` : ""}` : `${record.surname + ", " + record.name}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CardContainer>
            {record && !loading && <>
                <BasicInfoCard />
                <CommunicationInfoCard />
                <PrivateInfoCard />
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
    </CurrentPatientContext.Provider>)
};