'use strict';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {Button} from "../../ui/button";
import {DoctorListComponent} from "../../doctors/DoctorListComponent";
import {useNavigate} from "react-router";
import {ViewMode} from "../../buttons/ViewModeControl";
import {PatientListComponent} from "../../patients/PatientListComponent";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {HomeRecordHistoryWidgetContainer} from "./HomeRecordHistoryWidgetContainer";

export const PatientsCard = () => {
    const { patients } = useLocalHistory();
    const navigate = useNavigate();

    if(patients.history.length == 0) return <></>;

return <HomeRecordHistoryWidgetContainer
            title={"Pacientes"}
            description={"Últimos registros visitados"}
            onClick={() => navigate("/patients")}
        >
    <PatientListComponent loading={false} onClick={x => {
        navigate(`/patients/${x.id}`)
    }} viewMode={ViewMode.LITTLE_CARDS} items={patients.history} />

</HomeRecordHistoryWidgetContainer>
};