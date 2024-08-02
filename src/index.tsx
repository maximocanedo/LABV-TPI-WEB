import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './output.css';
import {CurrentUserProvider} from "./components/users/CurrentUserContext";
import {LocalHistoryContextProvider} from "./components/local/LocalHistoryContext";

const rootElement: HTMLElement = document.getElementById('root') as HTMLElement;

const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <LocalHistoryContextProvider>
            <CurrentUserProvider>
                <App />
            </CurrentUserProvider>
        </LocalHistoryContextProvider>
    </React.StrictMode>
);