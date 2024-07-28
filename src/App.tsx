import React, { useState } from 'react';
import {User} from "./entity/users";
import * as users from "./actions/users";
import './globals.css';
import './output.css';
import { Button } from "./components/ui/button"


const App: React.FC = () => {
    const [me, setCurrentUser] = useState<User | null>(null);
    const loadCurrentUser = async () => {
        users.myself()
            .then(setCurrentUser)
            .catch(console.error)
    };
    const loginTest = async () => {
        users.login("root", "12345678")
            .then(_response => loadCurrentUser())
            .catch(console.error);
    }
    return (
        <div className="App">
            dsfsdf
            <Button >Login</Button>
        </div>
    );
};

export default App;
