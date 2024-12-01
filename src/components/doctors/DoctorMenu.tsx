'use strict';
import {LocalMenu} from "../commons/LocalMenu";
import {MenuButton} from "../commons/MenuButton";
import {DoctorMinimalView, IDoctor} from "../../entity/doctors";
import {DoctorContextMenuOptions} from "./DoctorContextMenu";

export const DoctorMenu = (doctor: IDoctor | DoctorMinimalView) => {
    return <LocalMenu items={DoctorContextMenuOptions(doctor)}>
        <MenuButton />
    </LocalMenu>
};