import React, {useEffect, useState} from 'react';
import {User} from "./entity/users";
import * as users from "./actions/users";
import './globals.css';
import './output.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from "./components/ui/button";
import {LoginButtonSection} from "./components/login/LoginButtonSection";
import {Toaster} from "./components/ui/toaster";
import Link from "./components/text/Link";
import {useToast} from "./components/ui/use-toast";
import {
    Bell,
    Package2
} from "lucide-react";
import {LateralMenu} from "./components/page/commons/LateralMenu";
import {MainUserPage} from "./components/page/users/MainUserPage";
import {CurrentUserProvider, useCurrentUser} from "./components/users/CurrentUserContext";

export type CurrentUser = User | null | "loading";

const App: React.FC = () => {
    const { me, setCurrentUser, loadCurrentUser } = useCurrentUser();
    //const [me, setCurrentUser] = useState<CurrentUser>(null);
    const { toast } = useToast();
    /** const loadCurrentUser = async () => {
     setCurrentUser("loading");
     return users.myself()
     .then(x => {
     if(!x) setCurrentUser(null);
     setCurrentUser(x);
     })
     .catch((err) => {
     setCurrentUser(null);
     });
     };*/
    /* useEffect(() => {
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
    }, []); */
    const loginTest = async () => {
        setCurrentUser("loading");
        users.login("root", "12345678")
            .then(_response => loadCurrentUser())
            .catch(console.error);
    };

    return (
        <Router>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2 font-semibold">
                                <Package2 className="h-6 w-6"/>
                                <span className="">LABV-TPI</span>
                            </Link>
                            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                                <Bell className="h-4 w-4"/>
                                <span className="sr-only">Toggle notifications</span>
                            </Button>
                        </div>
                        <div className="flex-1">
                            <LateralMenu isInModal={false} />
                        </div>
                        <div className="mt-auto p-4">
                            <LoginButtonSection me={me} clearCurrentUser={() => setCurrentUser(null)} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <Routes>
                        <Route path={"/"} element={<></>}/>
                        <Route path={"/users"} element={<MainUserPage {...{me, clearCurrentUser: () => setCurrentUser(null)}} />}/>
                    </Routes>
                </div>
            </div>
            <Toaster/>
        </Router>
    );
};

export default App;
