import axios from "axios";
import {BASE_URL, config, withLogs} from "../core";

const AUTH_URL = `http://${BASE_URL}/api/auth/login`;
const REGISTER_URL = `http://${BASE_URL}/api/auth/register`;

export interface AuthProps{
    token: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    // axios.post returns a promise that will be resolved in the withLogs function in index.tsx
    return withLogs(axios.post(AUTH_URL, {username, password}, config), 'login');
}

export const register: (username?: string, password?: string) => Promise<AuthProps> = (username, password) => {
    return withLogs(axios.post(REGISTER_URL, {username, password}, config), 'register');
}