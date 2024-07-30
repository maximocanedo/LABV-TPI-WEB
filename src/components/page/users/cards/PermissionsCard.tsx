'use strict';

import {Card, CardContent, CardHeader} from "../../../ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../../ui/accordion";
import React from "react";
import {IUser, Permits} from "../../../../entity/users";
import {PermissionItem} from "./PermissionItem";

export interface PermissionsCardProps {
    user: IUser | null | undefined;
}

export const PermissionsCard = ({ user }: PermissionsCardProps) => {
    if(!user) return <></>;
    return (<Card>
        <CardHeader>
            <div className="font-semibold">Permisos</div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-3">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Usuarios</AccordionTrigger>
                        <AccordionContent>
                            <PermissionItem user={user} action={Permits.READ_USER_DATA} label={"Leer datos personales"} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </CardContent>
    </Card>);
}