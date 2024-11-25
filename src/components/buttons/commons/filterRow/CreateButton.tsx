'use strict';

import {CloudDownload, PlusIcon} from "lucide-react";
import {Button} from "../../../ui/button";
import React from "react";
import {Permit} from "../../../../entity/users";
import {useCurrentUser} from "../../../users/CurrentUserContext";
import { useNavigate } from "react-router-dom";

export interface CreateButtonProps {
    onClick: () => void;
    mustHave?: Permit[];
    disabled?: boolean
}

export const CreateButton = ({ onClick, mustHave, disabled }: CreateButtonProps) => {
    const { me, can } = useCurrentUser();
    return (!mustHave || mustHave.map(can).every(x => x)) ?
        <Button
            onClick={() => onClick()}
            variant={"default"}
            disabled={disabled ?? false}
            size={"sm"}
            className={"h-7 gap-1 text-sm" }>
            <PlusIcon className={"h-3.5 w-3.5"}/>
            <span className="sr-only sm:not-sr-only text-xs">Nuevo</span>
        </Button> : <></>;
};