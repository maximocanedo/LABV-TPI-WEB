import React, {createContext, useContext, useState, useEffect, ReactNode, useReducer} from 'react';
import {useToast} from "../ui/use-toast";
import * as users from "../../actions/users";
import {CurrentUserLoadedEvent} from "../../events";
import {CurrentUser} from "../users/CurrentUserContext";
import {IUser} from "../../entity/users";


interface LocalHistoryContextType {
    // Users:
    users: {
        history: IUser[];
        log: (payload: IUser) => void;
        clear: () => void;
        rem: (payload: IUser) => void;
    };
}

const LocalHistoryContext = createContext<LocalHistoryContextType | undefined>(undefined);

enum ActionType {
    LOG = "LOG",
    CLEAR = "CLEAR",
    REMOVE = "REMOVE"
}

const LIMIT = {
    users: 3
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

export const LocalHistoryContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [me, setCurrentUser] = useState<CurrentUser>(null);
    const [ h_users, reduceUsers ] = useReducer(ur, []);

    const logUser = (payload: IUser) => reduceUsers({ type: ActionType.LOG, payload });
    const clearUsers = () => reduceUsers({ type: ActionType.CLEAR, payload: null });
    const remUser = (payload: IUser) => reduceUsers({ type: ActionType.REMOVE, payload });

    return (
        <LocalHistoryContext.Provider value={{ users: { history: h_users, log: logUser, clear: clearUsers, rem: remUser } }}>
            {children}
        </LocalHistoryContext.Provider>
    );
};

export const useLocalHistory = (): LocalHistoryContextType => {
    const context = useContext(LocalHistoryContext);
    if (!context) {
        throw new Error("useCurrentUser must be used within a LocalHistoryContextProvider");
    }
    return context;
};
