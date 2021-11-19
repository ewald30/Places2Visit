import {getLogger} from "../core";
import {login as loginApi} from "./api"
import {register as registerApi} from "./api";
import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { Plugins } from '@capacitor/core';

const logger = getLogger('AuthenticationProvider')

type LoginFunction = (username?: string, password?: string) => void;
type LogoutFunction = () => void;
type RegisterFunction = (username?: string, password?: string) => void;

export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFunction;
    register?: RegisterFunction;
    logout ?: LogoutFunction;
    pendingAuthentication?: boolean;
    pendingRegistration?: boolean,
    username?: string;
    password?: string;
    token: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    pendingRegistration: false,
    token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike
}


export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, pendingRegistration, token } = state;

    const logout = useCallback<LogoutFunction>(logoutCallback, []);
    const login = useCallback<LoginFunction>(loginCallback, []);
    const register = useCallback<RegisterFunction>(registerCallback, []);

    useEffect(checkExistingTokenEffect, []);
    useEffect(authenticationEffect, [pendingAuthentication]);
    useEffect(registrationEffect, [pendingRegistration]);

    const childrenProps = { isAuthenticated, login, register, logout, isAuthenticating, authenticationError, token };

    return (
        <AuthContext.Provider value={childrenProps}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(username?: string, password?: string): void {
        logger('login...');
        setState({
            ...state,
            pendingAuthentication: true,
            username,
            password
        });
    }

    function registerCallback(username?: string, password?: string): void {
        logger('register...')
        setState({
            ...state,
            pendingRegistration: true,
            username,
            password
        });
    }

    function logoutCallback(): void{
        logger("logout...")
        setState({
            ...state,
            isAuthenticated: false,
            username: '',
            password: '',
            token: ''
        })
    }

    function checkExistingTokenEffect(){
        (async () => {
            const { Storage } = Plugins;
            const token = await Storage.get({ key: 'token' });
            if (token.value){
                setState({...state, isAuthenticated: true, token: token.value});
            }
        })()
    }

    function authenticationEffect() {
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate() {
            if (!pendingAuthentication) {
                logger('!pending authentication')
                return;
            }

            try {
                logger('authenticate...')
                setState({...state, isAuthenticating: true});
                const {username, password} = state;
                const {token} = await loginApi(username, password);

                if (canceled) {
                    return;
                }

                logger('authentication success!')
                if (token){
                    const {Storage} = Plugins;
                    await Storage.set({
                        key: "token",
                        value: token
                    });
                }
                setState({...state, token, pendingAuthentication: false, isAuthenticated:true, isAuthenticating: false});
            }
            catch (error){
                logger("authenticaiton error!")
                setState({...state, authenticationError: error, pendingAuthentication: false, isAuthenticating: false});
            }
        }
    }


    function registrationEffect() {
        console.log("asdasdads")
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate() {
            if (!pendingRegistration) {
                logger('!pending registration')
                return;
            }

            try {
                logger('registration...')
                setState({...state, isAuthenticating: true});
                const {username, password} = state;
                const {token} = await registerApi(username, password);

                if (canceled) {
                    return;
                }

                logger('registration success!')
                setState({...state, token, pendingRegistration: false, isAuthenticated:true, isAuthenticating: false});
            }
            catch (error){
                logger("registration error!")
                setState({...state, authenticationError: error, pendingRegistration: false, isAuthenticating: false});
            }
        }
    }
}