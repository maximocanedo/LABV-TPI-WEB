'use strict';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {Button} from "../../ui/button";
import {DoctorListComponent} from "../../doctors/DoctorListComponent";
import {useNavigate} from "react-router";
import {ViewMode} from "../../buttons/ViewModeControl";
import {PatientListComponent} from "../../patients/PatientListComponent";
import {ArrowRightIcon} from "@radix-ui/react-icons";

export const PatientsCard = () => {
    const { patients } = useLocalHistory();
    const navigate = useNavigate();

    if(patients.history.length == 0) return <></>;
    /* <Card className={"card col-span-2"}>
        <CardHeader>
            <CardTitle>Pacientes</CardTitle>
            <CardDescription>Últimos registros visitados</CardDescription>
        </CardHeader>
        <CardContent>
            <PatientListComponent vertical loading={false} onClick={x => {
                navigate(`/patients/${x.id}`)
            }} viewMode={ViewMode.LITTLE_CARDS} items={patients.history} />
        </CardContent>
        <CardFooter>
            <Button variant={"ghost"} onClick={() => navigate("/patients")}>
                Ver listado completo
            </Button>
        </CardFooter>
    </Card> // */
return <div className={"flex flex-col gap-y-2 max-w-[99%]"}>
    <div className={"flex flex-row gap-x-2 justify-between max-w-[99%]"}>
        <div className={"flex flex-col gap-y-1 w-full"}>
            <CardTitle>Pacientes</CardTitle>
            <CardDescription>Últimos registros visitados</CardDescription>
        </div>
        <Button variant={"ghost"} onClick={() => navigate("/patients")}>
            <ArrowRightIcon className={"w-[16px] h-[16px"} />
        </Button>
    </div>
    <PatientListComponent loading={false} onClick={x => {
        navigate(`/patients/${x.id}`)
    }} viewMode={ViewMode.LITTLE_CARDS} items={patients.history} />

    </div>
};