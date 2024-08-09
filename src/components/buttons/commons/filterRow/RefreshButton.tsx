'use strict';

import {Button} from "../../../ui/button";
import {RefreshCcw} from "lucide-react";
import {Spinner} from "../../../form/Spinner";
import React from "react";

export interface RefreshButtonProps {
    len: number;
    loading: boolean;
    handler: () => void;
}

export const RefreshButton = ({ loading, len, handler }: RefreshButtonProps) => {

    return <>{(loading || len > 0) &&
        <Button onClick={() => handler()} disabled={loading} variant="outline" size="sm"
                className="h-7 gap-1 text-sm">
            {!loading && <RefreshCcw className={"h-3.5 w-3.5"}/>}
            {loading && <Spinner className={"h-3.5 w-3.5"}/>}
            <span className="sr-only sm:not-sr-only text-xs">{loading ? "Cargando" : "Actualizar"}</span>
        </Button>}</>;
};