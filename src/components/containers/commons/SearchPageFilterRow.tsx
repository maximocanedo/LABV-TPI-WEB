'use strict';

export interface SearchPageFilterRowProps {
    children: React.ReactNode | React.ReactNode[];
}

export const SearchPageFilterRow = ({ children }: SearchPageFilterRowProps) => {

    return <div className="flex justify-start gap-2 w-full flex-wrap">
        {children}
    </div>;

}