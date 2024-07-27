'use strict';

import {Deletable, Identifiable, Saveable} from "./commons";

export interface SpecialtyProps {
    name: string;
    description: string;
}
export type Specialty = Identifiable & Deletable & Saveable & SpecialtyProps;