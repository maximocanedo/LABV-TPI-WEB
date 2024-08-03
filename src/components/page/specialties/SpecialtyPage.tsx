'use strict';

import {Header} from "../commons/Header";
import {Button} from "../../ui/button";
import {ArrowLeft} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {PageContent} from "../commons/PageContent";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../../ui/breadcrumb";
import {CommonException} from "../../../entity/commons";
import * as data from "../../../actions/specialties";
import {Specialty} from "../../../entity/specialties";
import {Spinner} from "../../form/Spinner";
import {RegularErrorPage} from "../commons/RegularErrorPage";
import {BasicInfoCard} from "./cards/BasicInfoCard";
import {UpdateBasicInfoCard} from "./cards/UpdateBasicInfoCard";
import {StateCard} from "./cards/StateCard";

export interface SpecialtyPageProps {

}
export interface SpecialtyPageParams extends Record<string, string> {
    id: string;
}

const extractNumbers = (input: string | undefined): number => {
    if(!input) return -1;
    const matches = input.match(/\d+/g);
    if (!matches) return -1;
    return parseInt(matches.join(''));
}

export const SpecialtyPage = (props: SpecialtyPageProps) => {
    const navigate = useNavigate();
    const { id: rawId } = useParams<SpecialtyPageParams>();

    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<CommonException | null>(null);

    const id: number = extractNumbers(rawId);

    const refresh = () => {
        if(!id) return;
        setErr(null);
        setLoading(true);
        data.findById(id)
            .then(record => {
                if(!record) setSpecialty(null);
                else setSpecialty(record);
                return;
            })
            .catch(setErr)
            .finally(() => setLoading(false));
    };
    useEffect(refresh, [ id ]);

    return (<>
        <Header>
            <div className="w-full flex-1">
                <Button onClick={() => {navigate(-1)}} variant={"ghost"} className={"flex-1"}><ArrowLeft className={"mr-3 w-4 h-4"}/><span
                    className={"text-sm"}>Volver</span></Button>
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
                        <BreadcrumbLink href="/specialties">Especialidades</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{(!specialty || loading) ? `Especialidad${id > -1 ? ` #${id}` : ""}` : `${specialty.name}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {!loading && !!specialty && <div className={"masonry gap-4 p-4 sm:px-6 sm:py-0 p-0 text-sm"}>
                <BasicInfoCard specialty={specialty} />
                <UpdateBasicInfoCard record={specialty} onUpdate={s => setSpecialty({ ...specialty, ...s })} />
                <StateCard record={specialty} onUpdate={(state: boolean) => {
                    setSpecialty({...specialty, active: state});
                }} />
            </div>}
            {loading && <div className={"grid w-full h-full place-items-center"}><Spinner /></div> }
            { (!loading && !!err) && <RegularErrorPage {...err} retry={refresh} /> }
        </PageContent>
    </>);
}