import React, {useEffect, useState} from 'react';
import {User} from "./entity/users";
import * as users from "./actions/users";
import './globals.css';
import './output.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from "./components/ui/button";
import {LoginButtonSection} from "./components/login/LoginButtonSection";
import {Toaster} from "./components/ui/toaster";
import {useToast} from "./components/ui/use-toast";

export type CurrentUser = User | null | "loading";

const App: React.FC = () => {
    const [me, setCurrentUser] = useState<CurrentUser>(null);
    const { toast } = useToast();
    const loadCurrentUser = async () => {
        setCurrentUser("loading");
        return users.myself()
            .then(setCurrentUser)
            .catch((err) => {
                setCurrentUser(null);
                console.error(err);
            });
    };
    useEffect(() => {
        loadCurrentUser();
        document.body.addEventListener("user-logged", async (e) => {
            await loadCurrentUser();
            if(me != null && me != "loading") {
                toast({
                    title: "¡Hola de nuevo, " + me.name + "!",
                    description: "¡Bienvenido!"
                })
            }
        });
    }, []);
    const loginTest = async () => {
        setCurrentUser("loading");
        users.login("root", "12345678")
            .then(_response => loadCurrentUser())
            .catch(console.error);
    };

    return (
        <Router>
            <div onLoad={() => loadCurrentUser()} className="App font-sans">
                <LoginButtonSection {...{ me, clearCurrentUser: (): void => {setCurrentUser(null);} }} /><br/>
                
            </div>
            <Routes>
                <Route path={"/users/:username"} element={<div>Not implemented</div>} />
            </Routes>
            <Toaster />
        </Router>
    );
};

export default App;
