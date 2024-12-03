'use strict';

import {Header} from "./commons/Header";
import React from "react";
import {PageContent} from "./commons/PageContent";
import {ReportCountApposByDayBetweenDates} from "./widgets/ReportCountApposByDayBetweenDates";
import {ReportCountApposBySpecialty} from "./widgets/ReportCountApposBySpecialty";
import {CardContainer} from "../containers/commons/CardContainer";

export interface HomePageProps {}

export const HomePage = ({}: HomePageProps) => {

    const oldCl = "w-full h-full grid grid-cols-3 gap-4";
    return <>
        <Header>
        </Header>
        <PageContent className={" px-0 "}>
            <CardContainer className={" px-0 sm:px-2 "}>
                <ReportCountApposByDayBetweenDates />
                <ReportCountApposBySpecialty />
            </CardContainer>
        </PageContent>
    </>;
};