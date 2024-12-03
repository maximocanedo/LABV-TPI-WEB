'use strict';

export interface CardContainerProps {
    children: React.ReactNode | React.ReactNode[];
    className?: string;
}

export const CardContainer = ({ children, className }: CardContainerProps) => {

    return (<div className={`masonry gap-4 sm:px-6 sm:py-0 p-0 text-sm ${className??""}`}>
        {children}
    </div>)
}