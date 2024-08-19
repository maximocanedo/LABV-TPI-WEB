'use strict';

import {Search} from "lucide-react";
import {Input} from "../ui/input";
import React, {useEffect, useState} from "react";
import {FilterStatus} from "../../actions/commons";

export interface SpecialtyCommandQueryProps {
    q?: string;
    onChange?: (value: string) => void;
    onSearch: (obj: any) => void;
    className?: string;
}

const fs = (str: string): FilterStatus | null => {
    switch(str) {
        case "all":
            return FilterStatus.BOTH;
        case "active":
            return FilterStatus.ONLY_ACTIVE;
        case "inactive":
            return FilterStatus.ONLY_INACTIVE;
        default:
            return null;
    }
}
// @ts-ignore
// @ts-ignore
export const SpecialtyCommandQuery = ({q: leg, onChange, onSearch, className }: SpecialtyCommandQueryProps) => {

    const [active, setActive] = useState<boolean>(false);
    const [q, setQ] = useState<string>(leg??"");
    const [finalQuery, setFinalQuery] = useState<string>("");
    const [status, setStatus] = useState<FilterStatus | null>(null);
    useEffect(() => {
        const p = /\bst:(\w+)/g;
        //const f: string | undefined =
        // @ts-ignore
        const foo = ([...q.matchAll(p)][0]??[])[1];
        const st: FilterStatus | null = !foo?null:fs(foo);
        setStatus(!st ? null : st);
        let f: string = q.replace(/\bst:\w+\s?/g, "");
        setFinalQuery(f);
    }, [q]);
    useEffect(() => {
        (onChange??((x:string):void=>{}))(finalQuery);
    }, [finalQuery]);

    const s = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch({filter: status});
    };

    return (<form action={"#"} onSubmit={s} className={" " + (className?? "")}>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    onChange={x => setQ(x.target.value)}
                    value={q}
                    placeholder="Buscar especialidades"
                    className="w-full appearance-none bg-background pl-8 shadow-none w-full"
                />
            </div>
        </form>
    );
};