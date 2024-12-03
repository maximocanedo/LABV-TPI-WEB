'use strict';

import {Header} from "../commons/Header";
import {PageContent} from "../commons/PageContent";
import {DefBackButton} from "../../buttons/DefBackButton";
import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import {useParams} from "react-router";
import {extractNumbers, SpecialtyPageParams} from "../specialties/SpecialtyPage";
import {Doctor, IDoctor} from "../../../entity/doctors";
import {CommonException} from "../../../entity/commons";
import * as data from "../../../actions/doctors";
import {BasicInfoCard} from "./cards/BasicInfoCard";
import {CommunicationInfoCard} from "./cards/CommunicationInfoCard";
import {PrivateInfoCard} from "./cards/PrivateInfoCard";
import {CardContainer} from "../../containers/commons/CardContainer";
import {StateCard} from "./cards/StateCard";
import { ScheduleChartCard } from "./cards/ScheduleChartCard";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {CurrentDoctorContext} from "./CurrentDoctorContext";
import { useLocalHistory } from "src/components/local/LocalHistoryContext";
import { LinkedUserCard } from "./cards/LinkedUserCard";
import {Skeleton} from "../../ui/skeleton";

export interface DoctorPageProps {

}
export interface DoctorPageParams extends Record<string, string> {
    file: string;
}

export const DoctorPage = ({  }: DoctorPageProps) => {

    const { file: rawFile } = useParams<DoctorPageParams>();
    const { doctors: { log, clear, rem, history }} = useLocalHistory();
    const [record, setRecord] = useState<IDoctor | Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<CommonException | null>(null);

    const file: number = extractNumbers(rawFile);

    useEffect(() => {
        if(record != null && !("error" in record)) log(record);
        console.log(history);
    }, [ record ]);

    const refresh = () => {
        if(!file) return;
        setErr(null);
        setLoading(true);
        data.findByFile(file)
            .then(record => {
                if(!record || ("message" in record)) setRecord(null);
                else setRecord(record);
                return;
            })
            .catch(setErr)
            .finally(() => setLoading(false));
    };
    useEffect(refresh, [ file ]);
    return (<CurrentDoctorContext.Provider value={{record, updater: setRecord}}>
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
                        <BreadcrumbLink href="/doctors">Médicos</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{(!record || record === undefined || loading) ? `${file > -1 ? `Médico #${file}` : ""}` : `${record.surname + ", " + record.name}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CardContainer>
                {record && <>
                    <BasicInfoCard />
                    <PrivateInfoCard />
                    <LinkedUserCard />
                    <CommunicationInfoCard />
                    <ScheduleChartCard />
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
            { (!loading && err != null) && <RegularErrorPage {...err} retry={refresh} /> }
        </PageContent>
    </CurrentDoctorContext.Provider>);
}