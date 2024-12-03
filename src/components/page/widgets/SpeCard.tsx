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
import {UserListComponent} from "../../users/UserListComponent";

export const SpeCard = () => {
    const { users } = useLocalHistory();
    const navigate = useNavigate();

    if(users.history.length == 0) return <></>;
    return <HomeRecordHistoryWidgetContainer
                title={"Usuarios"}
                description={"Últimos registros visitados"}
                onClick={() => navigate("/users")}
            >
        <UserListComponent loading={false} onClick={x => {
            navigate(`/users/${x.username}`)
        }} viewMode={ViewMode.LITTLE_CARDS} items={users.history} />
    </HomeRecordHistoryWidgetContainer>;
};