'use strict';

import { IUser } from "src/entity/users";
import {Identifiable} from "../entity/commons";

enum ListAction {
    ADD = "ADD",
    REMOVE = "REMOVE",
    CLEAR = "CLEAR",
    PREPEND = "PREPEND"
}
export const useListingBasicReducer = <T extends Identifiable>(state: T[], action: { type: ListAction, payload: T | null }): T[] => {
    if(!action.payload) {
        if(action.type == ListAction.CLEAR) return [];
        return [...state];
    }
    switch(action.type) {
        case ListAction.ADD:
            return [...(state.filter(x => x.id !== (action.payload as T).id)), action.payload];
        case ListAction.PREPEND:
            return [action.payload, ...(state.filter(x => x.id !== (action.payload as T).id))];
        case ListAction.REMOVE:
            return state.filter(x => x.id !== (action.payload as T).id);
        default:
            return [...state];
    }
}

export const useUserListingBasicReducer = (state: IUser[], action: { type: ListAction, payload: IUser | null }): IUser[] => {
    if(!action.payload) {
        if(action.type == ListAction.CLEAR) return [];
        return [...state];
    }
    switch(action.type) {
        case ListAction.ADD:
            return [...(state.filter(x => x.username !== (action.payload as IUser).username)), action.payload];
        case ListAction.PREPEND:
            return [action.payload, ...(state.filter(x => x.username !== (action.payload as IUser).username))];
        case ListAction.REMOVE:
            return state.filter(x => x.username !== (action.payload as IUser).username);
        default:
            return [...state];
    }
}


export const useDispatchers = <T>(dispatcherFunction: React.Dispatch<{type: ListAction, payload: T | null}>) => {
    return {
        add: (payload: T) => dispatcherFunction({ type: ListAction.ADD, payload }),
        remove: (payload: T) => dispatcherFunction({ type: ListAction.REMOVE, payload }),
        clear: () => dispatcherFunction({ type: ListAction.CLEAR, payload: null }),
        prepend: (payload: T) => dispatcherFunction({ type: ListAction.PREPEND, payload })
    };
};