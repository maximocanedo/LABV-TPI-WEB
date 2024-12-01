'use strict';

import {MenuOption} from "./menu.interfaces";
import {useToast} from "../ui/use-toast";
import {useNavigate} from "react-router";
import {ContextMenuItem} from "../ui/context-menu";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export const LocalMenuItem = (item: MenuOption) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const copy = (str: string) => {
        navigator.clipboard.writeText(str)
            .then(() => {
                toast({ title: `Copiado al portapapeles. ` });
            })
            .catch(err => {
                toast({ title: `No se pudo copiar al portapapeles. ` });
            });
    };
    if("condition" in item && !item.condition) return <></>;
    return (<DropdownMenuItem className={"pr-6"} onClick={() => {
        if("handler" in item && item.handler !== undefined) {
            item.handler();
        } else if("url" in item && item.url !== undefined) {
            window.open(item.url, "_blank");
        } else if("nav" in item && item.nav !== undefined) {
            navigate(item.nav);
        } else if("copy" in item && item.copy !== undefined) {
            copy(item.copy);
        } else {}
    }} inset>
        { item.label }
    </DropdownMenuItem>)
}