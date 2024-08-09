'use strict';

import {Button} from "../ui/button";
import {ArrowLeft} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const DefBackButton = () => {
    const navigate = useNavigate();
    return (<div className="w-full flex-1">
        <Button onClick={() => {
            navigate(-1)
        }} variant={"ghost"} className={"flex-1"}><ArrowLeft className={"mr-3 w-4 h-4"}/><span
            className={"text-sm"}>Volver</span></Button>
    </div>)
}