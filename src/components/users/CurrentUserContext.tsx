import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {Permit, User} from "../../entity/users";
import * as users from "../../actions/users";
import { useToast } from "../ui/use-toast";
import {CurrentUserLoadedEvent} from "../../events";

export type CurrentUser = User | null | "loading";

interface CurrentUserContextType {
    me: CurrentUser;
    setCurrentUser: (user: CurrentUser) => void;
    loadCurrentUser: () => Promise<void>;
    can: (action: Permit) => boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [me, setCurrentUser] = useState<CurrentUser>(null);
    const { toast } = useToast();

    const loadCurrentUser = async () => {
        setCurrentUser("loading");
        users.myself()
            .then(setCurrentUser)
            .catch(err => {
                console.error(err);
               users.myself()
                    .then(setCurrentUser)
                    .catch(err => {
                        console.error(err);
                        setCurrentUser(null);
                    });
            });
    };

    const can = (action: Permit): boolean =>
        me != null && me !== "loading" && me.active &&
        (me.access??[]).some(permit => permit === action);

    useEffect(() => {
        loadCurrentUser();
        const handleUserLogged = async () => {
            await loadCurrentUser();
            if (me !== null && me !== "loading") {
                toast({
                    title: `¡Hola de nuevo, ${me.name}!`,
                    description: "¡Bienvenido!"
                });
            }
        };
        document.body.addEventListener("user-logged", handleUserLogged);

        document.body.addEventListener(CurrentUserLoadedEvent.EVENT_NAME, (ev) => {
            setCurrentUser((ev as CurrentUserLoadedEvent).detail.user);
            console.info("Current user was updated. ", { me: (ev as CurrentUserLoadedEvent).detail.user });
        });
        return () => {
            document.body.removeEventListener("user-logged", handleUserLogged);
        };
    }, []);

    return (
        <CurrentUserContext.Provider value={{ me, setCurrentUser, loadCurrentUser, can }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

export const useCurrentUser = (): CurrentUserContextType => {
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error("useCurrentUser must be used within a CurrentUserProvider");
    }
    return context;
};
