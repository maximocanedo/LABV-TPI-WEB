'use strict';

import {Context, createContext} from "react";
import { IUser, User } from "src/entity/users";

export interface CurrentUserContext {
    record: User | IUser | null;
    updater: (updated: User | IUser | null) => void;
}
export const CurrentUserContext: Context<CurrentUserContext> = createContext<CurrentUserContext>({
    record: null,
    updater: (updated: User | IUser | null) => {}
});