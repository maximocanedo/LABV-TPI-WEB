import React, {createContext, useContext, useState, useEffect, ReactNode, useReducer, Dispatch} from 'react';
import {useToast} from "../ui/use-toast";
import * as users from "../../actions/users";
import {CurrentUserLoadedEvent} from "../../events";
import {CurrentUser} from "../users/CurrentUserContext";
import {IUser} from "../../entity/users";
import { Identifiable } from 'src/entity/commons';
import { IDoctor } from 'src/entity/doctors';
import {IPatient} from "../../entity/patients";
import {IAppointment} from "../../entity/appointments";

interface LocalHistoryContextManager<T extends {}> {
    history: T[];
    log: (payload: T) => void;
    clear: () => void;
    rem: (payload: T) => void;
}

interface LocalHistoryContextType {
    users: LocalHistoryContextManager<IUser>;
    doctors: LocalHistoryContextManager<IDoctor>;
    patients: LocalHistoryContextManager<IPatient>;
    appointments: LocalHistoryContextManager<IAppointment>;
}

const LocalHistoryContext = createContext<LocalHistoryContextType | undefined>(undefined);

enum ActionType {
    LOG = "LOG",
    CLEAR = "CLEAR",
    REMOVE = "REMOVE"
}

const LIMIT = {
    users: 3,
    def: 3
};

const ur = (state: IUser[], action: { type: ActionType, payload: IUser | null }): IUser[] => {
    if(!action.payload) return [ ...state ].slice(0, LIMIT.users);
    else if(action.type == ActionType.CLEAR) return [];
    else if(action.type == ActionType.LOG) {
        if(!action.payload || (state.length > 0 && state[0].username === action.payload.username)) return [ ...state ].slice(0, LIMIT.users);
        else {
            // @ts-ignore
            return [action.payload, ...([...state].filter(x => x.username != action.payload.username))].slice(0, LIMIT.users);
        }
    }
    else if(action.type == ActionType.REMOVE) {
        // @ts-ignore
        return state.filter(x => x.username !== action.payload.username).slice(0, LIMIT.users);
    } else return [ ...state ].slice(0, LIMIT.users);
}

const identifiableReducer = <T extends Identifiable>(state: T[], action: { type: ActionType, payload: T | null }): T[] => {
    if(!action.payload) return [ ...state ].slice(0, LIMIT.def);
    else if(action.type == ActionType.CLEAR) return [];
    else if(action.type == ActionType.LOG) {
        if(!action.payload || (state.length > 0 && state[0].id === action.payload.id)) return [ ...state ].slice(0, LIMIT.def);
        else {
            // @ts-ignore
            return [action.payload, ...([...state].filter(x => x.id != action.payload.id))].slice(0, LIMIT.def);
        }
    }
    else if(action.type == ActionType.REMOVE) {
        // @ts-ignore
        return state.filter(x => x.id !== action.payload.id).slice(0, LIMIT.def);
    } else return [ ...state ].slice(0, LIMIT.def);
}


const reduce = <T extends Identifiable>(red: Dispatch<{ type: ActionType; payload: T | null; }>) => {
    return {
        log: (payload: T) => {
            if(payload === undefined && payload == null) return;
            else red({type: ActionType.LOG, payload});
        },
        clear: () => red({ type: ActionType.CLEAR, payload: null }),
        rem: (payload: T) => red({ type: ActionType.LOG, payload })
    };
}

export const LocalHistoryContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [me, setCurrentUser] = useState<CurrentUser>(null);
    const [ h_users, reduceUsers ] = useReducer(ur, []);
    const [ d_doctors, reduceDoctors ] = useReducer(identifiableReducer<IDoctor>, []);
    const [ p_patients, reducePatients ] = useReducer(identifiableReducer<IPatient>, []);
    const [ a_appointments, reduceAppointments ] = useReducer(identifiableReducer<IAppointment>, []);

    const logUser = (payload: IUser) => reduceUsers({ type: ActionType.LOG, payload });
    const clearUsers = () => reduceUsers({ type: ActionType.CLEAR, payload: null });
    const remUser = (payload: IUser) => reduceUsers({ type: ActionType.REMOVE, payload });


    const doctors = reduce<IDoctor>(reduceDoctors);
    const patients = reduce<IPatient>(reducePatients);
    const appointments = reduce<IAppointment>(reduceAppointments);

    return (
        <LocalHistoryContext.Provider value={{ 
            users: { history: h_users, log: logUser, clear: clearUsers, rem: remUser },
            doctors: { history: d_doctors, ...doctors },
            patients: { history: p_patients, ...patients },
            appointments: { history: a_appointments, ...appointments }
            }}>
            {children}
        </LocalHistoryContext.Provider>
    );
};

export const useLocalHistory = (): LocalHistoryContextType => {
    const context = useContext(LocalHistoryContext);
    if (!context) {
        throw new Error("useLocalHistory must be used within a LocalHistoryContextProvider");
    }
    return context;
};
