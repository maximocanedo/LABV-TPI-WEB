'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import React from "react";
import {Specialty} from "../../../../entity/specialties";

export interface BasicInfoCardProps {
    specialty: Specialty | null | undefined;
}

export const BasicInfoCard = ({ specialty }: BasicInfoCardProps) => {
    if(!specialty) return <></>;
    return (<Card className={"card"}>
        <CardHeader>
            <div className="font-semibold">Información básica</div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                <ul className="grid gap-3">
                    <li className="flex flex-wrap items-start justify-between">
                        <span className="text-muted-foreground">Nombre:</span>
                        <span>{specialty.name}</span>
                    </li>
                    <li className="flex flex-wrap items-start justify-between">
                        <span className="text-muted-foreground">Descripción:</span>
                        <span>{specialty.description}</span>
                    </li>
                    <li className="flex items-start flex-wrap justify-between">
                        <span className="text-muted-foreground">Estado:</span>
                        <span>{specialty.active ? "Habilitado" : "Deshabilitado"}</span>
                    </li>
                </ul>
            </div>
        </CardContent>
    </Card>);
}