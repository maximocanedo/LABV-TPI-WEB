'use strict';
import {FilterStatus} from "../../actions/commons";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import {Filter, ListFilter, Rows2, Rows3, Table} from "lucide-react";
import {TabsTrigger} from "../ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
export enum ViewMode {
    TABLE = "TABLE",
    COMPACT = "COMPACT",
    COMFY = "COMFY"
}
export interface ViewModeControlProps {
    onChange: (tab: ViewMode) => void;
}
export const ViewModeControl = ({ onChange }: ViewModeControlProps) => {

    let iconClass = "h-3.5 w-3.5";
    let comfyIcon = <Rows2 className={iconClass} />;
    let compactIcon = <Rows3 className={iconClass} />;
    let tableIcon = <Table className={iconClass} />;

    return (<TabsList  className="grid bg-muted p-1 rounded-lg grid-cols-3">
        <TabsTrigger onClick={()=>onChange(ViewMode.COMFY)} value="COMFY">{comfyIcon}</TabsTrigger>
        <TabsTrigger onClick={()=>onChange(ViewMode.COMPACT)} value="COMPACT">{compactIcon}</TabsTrigger>
        <TabsTrigger onClick={()=>onChange(ViewMode.TABLE)} value="TABLE">{tableIcon}</TabsTrigger>
    </TabsList>);
};