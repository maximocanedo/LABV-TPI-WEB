'use strict';

export interface CardContainerProps {
    children: React.ReactNode | React.ReactNode[];
}

export const CardContainer = ({ children }: CardContainerProps) => {

    return (<div className={"masonry gap-4 p-4 sm:px-6 sm:py-0 p-0 text-sm"}>
        {children}
    </div>)
}