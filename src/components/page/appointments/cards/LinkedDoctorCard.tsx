'use strict';
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { resolveLocalUrl } from "src/auth";
import { UserButtonSelector } from "src/components/dialog-selectors/users/UserButtonSelector";
import { DoctorListItem } from "src/components/doctors/DoctorListItem";
import { z } from "zod";
import * as users from "../../../../actions/users";
import { IUser, Permits } from "../../../../entity/users";
import { Spinner } from "../../../form/Spinner";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../ui/form";
import { useToast } from "../../../ui/use-toast";
import { useCurrentUser } from "../../../users/CurrentUserContext";
import { ViewMode } from "src/components/buttons/ViewModeControl";
import { DoctorButtonSelector } from "src/components/dialog-selectors/doctors/DoctorButtonSelector";
import { IDoctor } from "src/entity/doctors";
import {CurrentAppointmentContext} from "../CurrentAppointmentContext";

export interface LinkedDoctorCardProps {
}


export const LinkedDoctorCard = ({ }: LinkedDoctorCardProps) => {
    const {record, updater} = useContext(CurrentAppointmentContext);
    const navigate = useNavigate();
    if(record == null || record.assignedDoctor == null) return <></>;
    return (<Card className={"card"}>
                <CardHeader>
                    <div className="font-semibold">Médico asignado</div>
                </CardHeader>
                <CardContent>
                    { <DoctorListItem viewMode={ViewMode.LITTLE_CARDS} record={record?.assignedDoctor?? null} onClick={doctor => {
                        navigate(resolveLocalUrl('/doctors/' + doctor.file));
                    }}  /> }
                </CardContent>
            </Card>);
};

//*/