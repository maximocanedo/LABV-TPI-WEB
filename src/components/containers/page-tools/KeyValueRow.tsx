'use strict';

import React from "react";

export interface KeyValueRowProps {
    title: string;
    children: React.ReactNode | React.ReactNode[];
    prefix?: string;
    suffix?: string;
}

export const KeyValueRow = ({ title, children, prefix, suffix }: KeyValueRowProps) => {

    return (<li className="flex flex-wrap items-start justify-between">
        <span className="text-muted-foreground">{prefix??""}{title}{suffix??": "}</span>
        <span>{children}</span>
    </li>);
};