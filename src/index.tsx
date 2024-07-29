import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './output.css';
import {CurrentUserProvider} from "./components/users/CurrentUserContext";

const rootElement: HTMLElement = document.getElementById('root') as HTMLElement;

const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <CurrentUserProvider>
            <App />
        </CurrentUserProvider>
    </React.StrictMode>
);