'use strict';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {useLocalHistory} from "../../local/LocalHistoryContext";
import {Button} from "../../ui/button";
import {DoctorListComponent} from "../../doctors/DoctorListComponent";
import {useNavigate} from "react-router";
import {ViewMode} from "../../buttons/ViewModeControl";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {PatientListComponent} from "../../patients/PatientListComponent";
import {HomeRecordHistoryWidgetContainer} from "./HomeRecordHistoryWidgetContainer";

export const DoctorsCard = () => {
    const { doctors } = useLocalHistory();
    const navigate = useNavigate();

    if(doctors.history.length == 0) return <></>;
    return <HomeRecordHistoryWidgetContainer
                title={"Médicos"}
                description={"Últimos registros visitados"}
                onClick={() => navigate("/doctors")}
            >
        <DoctorListComponent loading={false} onClick={x => {
            navigate(`/doctors/${x.file}`)
        }} viewMode={ViewMode.LITTLE_CARDS} items={doctors.history} />
    </HomeRecordHistoryWidgetContainer>;
};