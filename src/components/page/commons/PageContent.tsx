'use strict';

import React, {DetailedHTMLProps} from "react";

export interface PageContentComponentProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    fullHeight?: boolean;
}

export const PageContent = ({children, ...props}: PageContentComponentProps) => {
    const cs: string = "root-main" + (props.fullHeight ? "__fullHeight":"");
    return (<main {...props} className={[cs, "flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"].join(" ")}>
        {children}
    </main>);
}