'use strict';

import {Specialty} from "../../../entity/specialties";
import {Link} from "react-router-dom";
import {resolveLocalUrl} from "../../../auth";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../../ui/hover-card";

export interface SpecialtyLinkProps {
    record: Specialty;
}

export const SpecialtyLink = ({ record }: SpecialtyLinkProps) => {

    return <HoverCard>
        <HoverCardTrigger asChild>
            <Link className={"hover:underline-offset-2 hover:underline"} to={resolveLocalUrl("/specialties/" + record.id)}>{record.name}</Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 text-wrap">
            <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{record.name}</h4>
                    <p className="text-sm">
                        {record.description}
                    </p>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>;
    //return ;
}