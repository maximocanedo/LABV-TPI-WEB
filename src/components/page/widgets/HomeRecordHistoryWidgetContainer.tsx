'use strict';

import {CardDescription, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {DoctorListComponent} from "../../doctors/DoctorListComponent";
import {ViewMode} from "../../buttons/ViewModeControl";

export interface HomeRecordHistoryWidgetContainerProps {
    title: string;
    description: string;
    onClick: () => void;
    children: React.ReactNode | React.ReactNode[];
}

export const HomeRecordHistoryWidgetContainer = ({ title, description, onClick, children }: HomeRecordHistoryWidgetContainerProps) => {

    return <div className={"flex flex-col gap-y-2 max-w-[99%]"}>
        <div className={"flex flex-row gap-x-2 justify-between max-w-[99%]"}>
            <div className={"flex flex-col gap-y-1 w-full"}>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
            <Button variant={"ghost"} onClick={onClick}>
                <ArrowRightIcon className={"w-[16px] h-[16px"}/>
            </Button>
        </div>
        {children}
    </div>
}