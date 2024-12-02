'use strict';

import {AppointmentMinimalView, IAppointment} from "../../../entity/appointments";
import {AppointmentContextMenuOptions} from "./AppointmentContextMenu";
import {LocalMenu} from "../../commons/LocalMenu";
import {MenuButton} from "../../commons/MenuButton";

export const AppointmentMenu = (patient: IAppointment | AppointmentMinimalView) => {
    return <LocalMenu items={AppointmentContextMenuOptions(patient)}>
        <MenuButton />
    </LocalMenu>
};