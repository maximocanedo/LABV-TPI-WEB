'use strict';

import {Header} from "./commons/Header";
import React from "react";
import {PageContent} from "./commons/PageContent";
import {ReportCountApposByDayBetweenDates} from "./widgets/ReportCountApposByDayBetweenDates";
import {ReportCountApposBySpecialty} from "./widgets/ReportCountApposBySpecialty";
import {CardContainer} from "../containers/commons/CardContainer";
import {CancelledCard} from "./widgets/CancelledCard";
import {DoctorsCard} from "./widgets/DoctorsCard";
import {PatientsCard} from "./widgets/PatientsCard";
import {AppointmentsCard} from "./widgets/AppointmentsCard";
import {SpeCard} from "./widgets/SpeCard";

export interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {

    const oldCl = "w-full h-full grid grid-cols-3 gap-4";
    return <>
        <Header>
        </Header>
        <PageContent className={" px-0 "}>
            <div className={"flex flex-row gap-x-2 px-0 sm:px-0 items-start"}>
                <div className={"flex-1 basis-1/3"}>
                    <ReportCountApposByDayBetweenDates/>
                </div>
                <div className={"flex-1 basis-1/3"}>
                    <ReportCountApposBySpecialty/>
                </div>
                <div className={"flex-1 basis-1/3"}>
                    <CancelledCard/>
                </div>
            </div>
            <AppointmentsCard />
            <DoctorsCard/>
            <PatientsCard/>
            <SpeCard />
        </PageContent>
    </>;
};