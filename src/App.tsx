import React, {useEffect, useState} from 'react';
import {User} from "./entity/users";
import * as users from "./actions/users";
import './globals.css';
import './output.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from "./components/ui/button";
import {LoginButtonSection} from "./components/login/LoginButtonSection";
import {Toaster} from "./components/ui/toaster";

export type CurrentUser = User | null | "loading";

const App: React.FC = () => {
    const [me, setCurrentUser] = useState<CurrentUser>(null);

    const loadCurrentUser = async () => {
        setCurrentUser("loading");
        users.myself()
            .then(setCurrentUser)
            .catch((err) => {
                setCurrentUser(null);
                console.error(err);
            });
    };
    useEffect(() => {
        loadCurrentUser();
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
                <Button onClick={loginTest}>Login</Button><br/><br/>
            </div>
            <Routes>
                <Route path={"/users/:username"} element={<div>Not implemented</div>} />
            </Routes>
            <Toaster />
        </Router>
    );
};

export default App;
