'use strict';

import {LocalMenu} from "../commons/LocalMenu";
import {IPatient, PatientCommunicationView} from "../../entity/patients";
import {MenuButton} from "../commons/MenuButton";
import {PatientContextMenuOptions} from "./PatientContextMenu";

export const PatientMenu = (patient: IPatient | PatientCommunicationView) => {
    return <LocalMenu items={PatientContextMenuOptions(patient)}>
        <MenuButton />
    </LocalMenu>
};