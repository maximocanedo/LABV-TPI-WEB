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
import React, {useState} from "react";
import {DoctorCommandQuery} from "../../commands/DoctorCommandQuery";
import {DoctorQueryCleaned} from "../../../actions/query.utils";
import {FilterStatus} from "../../../actions/commons";
import {weekday} from "../../../entity/doctors";
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

export interface MainDoctorsPageProps {

}

export const MainDoctorsPage = (props: MainDoctorsPageProps) => {

    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMFY);
    const [queryText, setQueryText] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus>(FilterStatus.ONLY_ACTIVE);
    const [day, setDay] = useState<weekday | null>(null);
    const [checkUnassigned, setCheckUnassigned] = useState<boolean>(false);
    const [specialty, setSpecialty] = useState<Specialty | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const search = (additional: DoctorQueryCleaned = { q: queryText }) => {
        const q: DoctorQueryCleaned = { status, day, unassigned: checkUnassigned, ...additional };
        setQueryText(q.q);
        if(q.status) setStatus(q.status);
        if(q.day) setDay(q.day);
        if(q.unassigned) setCheckUnassigned(q.unassigned);

        console.log(q);
    };

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
            <div className="flex justify-between gap-2 w-full">
                <Tabs defaultValue="COMFY" className="w-[250px]">
                    <ViewModeControl onChange={setViewMode}/>
                </Tabs>
                <StatusFilterControl value={status} disabled={false} onChange={setStatus}/>
                <WeekdayControl value={day} disabled={false} onChange={setDay} />
                <SpecialtyFilterSelector value={specialty} onChange={setSpecialty} />
                {(loading || [].length > 0) &&
                    <Button onClick={() => search()} disabled={loading} variant="outline" size="sm"
                            className="h-7 gap-1 text-sm">
                        {!loading && <RefreshCcw className={"h-3.5 w-3.5"}/>}
                        {loading && <Spinner className={"h-3.5 w-3.5"}/>}
                        <span className="sr-only sm:not-sr-only text-xs">{loading ? "Cargando" : "Actualizar"}</span>
                    </Button>}
                <div className="w-full"></div>
                <Button onClick={() => {
                }} variant={"outline"} disabled={true} size={"sm"} className={"h-7 gap-1 text-sm"}>
                    <CloudDownload className={"h-3.5 w-3.5"}/>
                    <span className="sr-only sm:not-sr-only text-xs">Exportar</span>
                </Button>
            </div>
        </PageContent>
    </>);
};