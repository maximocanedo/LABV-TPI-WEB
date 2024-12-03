'use strict';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {Button} from "../../ui/button";
import {DoctorListComponent} from "../../doctors/DoctorListComponent";
import {useNavigate} from "react-router";
import {ViewMode} from "../../buttons/ViewModeControl";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {PatientListComponent} from "../../patients/PatientListComponent";

export const DoctorsCard = () => {
    const { doctors } = useLocalHistory();
    const navigate = useNavigate();

    if(doctors.history.length == 0) return <></>;
    return <div className={"flex flex-col gap-y-2 max-w-[99%]"}>
        <div className={"flex flex-row gap-x-2 justify-between max-w-[99%]"}>
            <div className={"flex flex-col gap-y-1 w-full"}>
                <CardTitle>Médicos</CardTitle>
                <CardDescription>Últimos registros visitados</CardDescription>
            </div>
            <Button variant={"ghost"} onClick={() => navigate("/doctors")}>
                <ArrowRightIcon className={"w-[16px] h-[16px"} />
            </Button>
        </div>
        <DoctorListComponent loading={false} onClick={x => {
            navigate(`/doctors/${x.file}`)
        }} viewMode={ViewMode.LITTLE_CARDS} items={doctors.history} />

    </div>
};