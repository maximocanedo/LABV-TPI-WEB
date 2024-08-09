'use strict';

import {Button} from "../../ui/button";
import {ChevronDown, Plus} from "lucide-react";
import React from "react";
import {Spinner} from "../../form/Spinner";

export interface PaginatorButtonProps {
    loading: boolean;
    len: number;
    handler: () => void;
}

export const PaginatorButton = ({ loading, len, handler }: PaginatorButtonProps) => {
    if(!len) return <div></div>;
    return <div>
        <Button variant={"ghost"} disabled={loading} className={"rounded-xl mb-3"} onClick={handler}>{ loading ? <Spinner className={"w-4 h-4 mr-2"} /> : <ChevronDown className={"mr-2"}/>}{loading ? "Cargando" : "Mostrar más"}</Button>
    </div>;
}