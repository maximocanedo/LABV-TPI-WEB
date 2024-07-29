import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from "../../entity/users";
import * as users from "../../actions/users";
import { useToast } from "../ui/use-toast";

export type CurrentUser = User | null | "loading";

interface CurrentUserContextType {
    me: CurrentUser;
    setCurrentUser: (user: CurrentUser) => void;
    loadCurrentUser: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [me, setCurrentUser] = useState<CurrentUser>(null);
    const { toast } = useToast();

    const loadCurrentUser = async () => {
        setCurrentUser("loading");
        try {
            const user = await users.myself();
            setCurrentUser(user || null);
        } catch (err) {
            setCurrentUser(null);
        }
    };

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
        return () => {
            document.body.removeEventListener("user-logged", handleUserLogged);
        };
    }, []);

    return (
        <CurrentUserContext.Provider value={{ me, setCurrentUser, loadCurrentUser }}>
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
