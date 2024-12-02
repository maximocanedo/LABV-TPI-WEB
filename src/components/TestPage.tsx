'use strict';

import {useState} from "react";
import {PatientButtonSelector} from "./dialog-selectors/patients/PatientButtonSelector";
import {IPatient} from "../entity/patients";

export interface TestPageProps {}

export const TestPage = ({}: TestPageProps) => {
    const [ record, setRecord ] = useState<IPatient | null>(null);

    return (<div className="w-full h-screen flex justify-center items-center">
        <div className={"w-[350px]"}>
            <PatientButtonSelector value={record} onChange={setRecord} nullable={false} />
        </div>
    </div>)
};