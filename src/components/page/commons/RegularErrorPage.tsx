'use strict';

import {Button} from "../../ui/button";
import {useNavigate} from "react-router";
import {resolveLocalUrl} from "../../../auth";

export interface RegularErrorPageProps {
    message?: string;
    description?: string;
    path?: string;
    retry?: () => void;
    retryLabel?: string;
}

export const RegularErrorPage = ({ message, description, path, retry, retryLabel }: RegularErrorPageProps) => {
    const navigate = useNavigate();
    return <div className="w-full flex-1 h-full grid place-items-center">
        <div className={"grid place-items-center gap-3"}>
            <p className="text-sm text-muted-foreground">{path ?? "err/unknown"}</p>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{message ?? "Ocurrió un error desconocido. "}</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">{description ?? "Es todo lo que sabemos. "}</p>
            <br/>
            <div className="flex flex-row gap-2 justify-center">
                <Button onClick={() => navigate(resolveLocalUrl("/")) } variant={"ghost"}>Ir a inicio</Button>
                {retry && <Button onClick={retry} variant={"default"}>{retryLabel ?? "Reintentar"}</Button>}
            </div>
        </div>
    </div>;
};