'use strict';

import { useCurrentUser } from "src/components/users/CurrentUserContext";
import { Permits } from "src/entity/users";
import { PageContent } from "../commons/PageContent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "src/components/ui/breadcrumb";
import { SpecialtyRegisterForm } from "./SpecialtyRegisterForm";

export interface CreateSpecialtyPageProps {

}

export const CreateSpecialtyPage = ({}: CreateSpecialtyPageProps) => {
    const { me, can } = useCurrentUser();

    if(me == "loading") return null;
    if(!me || !me.active || !can(Permits.CREATE_SPECIALTY)) return null;
    return <PageContent>
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
                    <BreadcrumbPage>Nueva especialidad</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <SpecialtyRegisterForm />
    </PageContent>;
};