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
import { useCurrentUser } from "../users/CurrentUserContext";

export interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {
    const { me } = useCurrentUser();
    const oldCl = "w-full h-full grid grid-cols-3 gap-4";
    const h: number = new Date().getHours();
    const greeting: string = (
        (h > 21 ? "Buenas noches"
            : (h > 12 ? "Buenas tardes"
                 : "Buenos días")  ) + ( me != null && me != "loading" ? `, ${me.name}` : "")
    );
    return <>
        <Header>
        </Header>

        {me != null && me !== "loading" ? (<PageContent className={" px-0 "}>
            <h1 className={"py-3 text-2xl font-bold"}>{greeting}</h1>
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
        </PageContent>) : <PageContent>
            <h1 className={"py-3 text-2xl font-bold"}>No iniciaste sesión. </h1>
            <p>Iniciá sesión para continuar. </p>
        </PageContent>}

    </>;
};