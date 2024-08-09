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

export interface DoctorPageProps {

}
export interface DoctorPageParams extends Record<string, string> {
    file: string;
}

export const DoctorPage = ({  }: DoctorPageProps) => {

    const { file: rawFile } = useParams<DoctorPageParams>();

    const [record, setRecord] = useState<IDoctor | Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<CommonException | null>(null);

    const file: number = extractNumbers(rawFile);

    const refresh = () => {
        if(!file) return;
        setErr(null);
        setLoading(true);
        data.findByFile(file)
            .then(record => {
                if(!record) setRecord(null);
                else setRecord(record);
                return;
            })
            .catch(setErr)
            .finally(() => setLoading(false));
    };
    useEffect(refresh, [ file ]);
    return (<>
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
            {record && <CardContainer>
                <BasicInfoCard record={record} updater={setRecord} />
                <PrivateInfoCard record={record} updater={setRecord} />
                <CommunicationInfoCard record={record} updater={setRecord} />
                <ScheduleChartCard record={record} />
                <StateCard record={record} onUpdate={(updated: boolean): void => {
                    const newRecord = { ...record, active: updated };
                    setRecord(newRecord);
                }} />
            </CardContainer>}
            { (!loading && err != null) && <RegularErrorPage {...err} retry={refresh} /> }
        </PageContent>
    </>);
}