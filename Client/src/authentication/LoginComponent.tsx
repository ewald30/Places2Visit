import {getLogger} from "../core";
import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLoading, IonButton} from "@ionic/react";
import {AuthContext} from "./AuthenticationProvider";
import {Redirect} from "react-router-dom";
import { Plugins } from '@capacitor/core';


const logger = getLogger('Login component')

interface LoginState {
    username?: string,
    password?: string
}

export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const [state, setState] = useState<LoginState>({});
    const {isAuthenticated, isAuthenticating, login, authenticationError} = useContext(AuthContext);
    const {username, password} = state;


    const handleLogin = () => {
        logger("logging in...");
        login?.(username, password);
    };

    if (isAuthenticated)
        return <Redirect to={{pathname: '/'}}/>

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput placeholder="Username" value={username} onIonChange={e => setState({...state, username: e.detail.value || ''})}/>
                <IonInput placeholder="Password" value={password} onIonChange={e => setState({...state, password: e.detail.value || ''})}/>
                <IonLoading isOpen={isAuthenticating}/>

                {authenticationError && (
                    <div>{authenticationError.message || 'Failed to authenticate'}</div>
                )}

                <IonButton onClick={handleLogin}>Login</IonButton>
            </IonContent>
        </IonPage>
    );
}