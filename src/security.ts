'use strict';

export const updateRefreshToken = (refreshToken: string): void => {
    localStorage.setItem("_rT", refreshToken);
};

export const updateAccessToken = (accessToken: string): void => {
    localStorage.setItem("_aT", accessToken);
};

export const updateSessionToken = (token: string | null): void => {
    if(token == null) return;
    const [header, content]: string[] = token.split(" ");
    if(content !== undefined) {
        (header == "Refresh") && updateRefreshToken(token);
        (header == "Bearer") && updateAccessToken(token);
    }
};

const parseJwt = <T = any>(token: string): T | null => {
    try {
        const base64Url: string = token.split('.')[1];
        const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload: string = decodeURIComponent(atob(base64).split('').map((c: string): string => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload) as T;
    } catch (error) {
        console.error('Error decodificando JWT: ', error);
        return null;
    }
};

const isTokenExpired = (token: string): boolean => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
        return true; 
    }
    const currentTime: number = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

export const getRefreshToken = () => localStorage.getItem("_rT");
export const getAccessToken = () => localStorage.getItem("_aT");
export const getToken = (): string => {
    const accessToken: string | null = getAccessToken();
    const refreshToken: string | null = getRefreshToken();
    if(accessToken == null || isTokenExpired(accessToken)) {
        console.warn("Token de ACCESO expirado: Se autenticará con el token de REFRESCO disponible. ");
        return refreshToken?? "";
    }
    return accessToken;
};