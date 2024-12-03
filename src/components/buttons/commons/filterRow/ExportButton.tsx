'use strict';
import * as YAML from "js-yaml";
import * as XLSX from "xlsx";
import {CloudDownload} from "lucide-react";
import {Button} from "../../../ui/button";
import React from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel} from "src/components/ui/dropdown-menu";
import {DropdownMenuTrigger} from "../../../ui/dropdown-menu";

export interface ExportButtonProps<T> {
    handler?: () => void; // No usar.
    records?: T[]
}

export const ExportButton = <T,>({ handler, records }: ExportButtonProps<T>) => {

    const exec = (url: string, name: string) => {
        const a: HTMLAnchorElement = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    }

    const exportAsJson = (): void => {
        if (!records) return;

        const jsonString: string = JSON.stringify(records, null, 2); // Formatea el JSON
        const blob: Blob = new Blob([jsonString], { type: "application/json" });
        const url: string = URL.createObjectURL(blob);
        exec(url, "export.json");
    };

    const exportAsYaml = (): void => {
        if (!records) return;
        const blob: Blob = new Blob([YAML.dump(records)], { type: "text/yaml" });
        const url: string = URL.createObjectURL(blob);
        exec(url, "export.yaml");
    };

    const exportAsXlsx = () => {
        if (!records || records.length === 0) return;
        const worksheet = XLSX.utils.json_to_sheet(records);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        XLSX.writeFile(workbook, "export.xlsx");
    };

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={"outline"} disabled={!records || records.length == 0} size={"sm"} className={"h-7 gap-1 text-sm ml-auto" }>
                <CloudDownload className={"h-3.5 w-3.5"}/>
                <span className="sr-only sm:not-sr-only text-xs">Exportar</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
                <DropdownMenuLabel>Exportar {records?.length} elementos como</DropdownMenuLabel>
                <DropdownMenuItem onClick={exportAsJson}>
                    Archivo JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsYaml}>
                    Archivo YAML
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <hr />
            <DropdownMenuGroup>
                <DropdownMenuLabel className={"text-xs "}>Formatos experimentales</DropdownMenuLabel>
                <DropdownMenuItem onClick={exportAsXlsx}>
                    Hoja de cálculo de Excel
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
};