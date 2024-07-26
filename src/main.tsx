import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Importa tu archivo de estilos globales

// Crea el root container donde se montará la aplicación
const rootElement = document.getElementById('root') as HTMLElement;

// Usa ReactDOM.createRoot para inicializar y renderizar la aplicación
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);