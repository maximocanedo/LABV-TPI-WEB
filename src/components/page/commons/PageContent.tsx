'use strict';

import React, {DetailedHTMLProps} from "react";

export const PageContent = ({children, ...props}: DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
    return (<main {...props} className="root-main flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {children}
    </main>);
}