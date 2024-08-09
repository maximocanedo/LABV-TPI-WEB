'use strict';

export interface KeyValueListProps {
    children: React.ReactNode[] | React.ReactNode;
}

export const KeyValueList = ({ children }: KeyValueListProps) => {

    return (
        <div className="grid gap-3">
            <ul className="grid gap-3">
                {children}
            </ul>
        </div>
    );
}