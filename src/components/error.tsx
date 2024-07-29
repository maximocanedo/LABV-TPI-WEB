import React, { Component, ReactNode, createContext, useContext } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryContextProps {
    log: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextProps | undefined>(undefined);

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("\x1B[;34;1m" + errorInfo + "\x1B[m", error, errorInfo);
        this.setState({ errorInfo });
    }

    log = (error: Error, errorInfo: React.ErrorInfo) => {
        console.log("Logged error:", error, errorInfo);
    };

    render() {
        if (this.state.hasError) {
            return <h1>Algo salió mal.</h1>;
        }

        return (
            <ErrorBoundaryContext.Provider value={{ log: this.log }}>
                {this.props.children}
            </ErrorBoundaryContext.Provider>
        );
    }
}

export { ErrorBoundary, ErrorBoundaryContext };
