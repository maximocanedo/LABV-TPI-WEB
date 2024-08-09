'use strict';

import {CloudDownload} from "lucide-react";
import {Button} from "../../../ui/button";
import React from "react";

export interface ExportButtonProps {
    handler: () => void;
}

export const ExportButton = ({ handler }: ExportButtonProps) => {

    return <Button onClick={() => handler()} variant={"outline"} disabled={true} size={"sm"} className={"h-7 gap-1 text-sm ml-auto" }>
        <CloudDownload className={"h-3.5 w-3.5"}/>
        <span className="sr-only sm:not-sr-only text-xs">Exportar</span>
    </Button>
};