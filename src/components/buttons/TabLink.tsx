'use strict';

import {NotebookTabs} from "lucide-react";
import Link from "../text/Link";
import React, {AnchorHTMLAttributes} from "react";
import {useNavigate} from "react-router";
import {resolveLocalUrl} from "../../auth";

export interface TabLinkProps extends  AnchorHTMLAttributes<HTMLAnchorElement> {
    active: boolean;
}

export const TabLink = ({active, ...props}: TabLinkProps) => {

    const navigate = useNavigate();


    return <Link {...props} href={"#"} onClick={(e) => {
        e.preventDefault();
        navigate(resolveLocalUrl(props.href?? ""));
    }} className={"flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary " + (active && "bg-muted")}>
        {props.children}
    </Link>;
}