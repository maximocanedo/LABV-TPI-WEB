import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './output.css';

const rootElement: HTMLElement = document.getElementById('root') as HTMLElement;

const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);