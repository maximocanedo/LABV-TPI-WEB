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
import {Appointments} from "../appointments/Appointments";
import { AppointmentListComponent } from "../appointments/AppointmentListComponent";

export const AppointmentsCard = () => {
    const { appointments } = useLocalHistory();
    const navigate = useNavigate();

    if(appointments.history.length == 0) return <></>;
    return <HomeRecordHistoryWidgetContainer
                title={"Turnos"}
                description={"Últimos registros visitados"}
                onClick={() => navigate("/appointments")}
            >
        <AppointmentListComponent loading={false} onClick={x => {
            navigate(`/appointments/${x.id}`)
        }} viewMode={ViewMode.LITTLE_CARDS} items={appointments.history} />
    </HomeRecordHistoryWidgetContainer>;
};