import {getLogger} from "../core";
import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";
import {AuthContext} from "./AuthenticationProvider";
import {Redirect} from "react-router-dom";
import {IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar} from "@ionic/react";


const logger = getLogger('Login component')

interface RegisterState {
    username?: string,
    password?: string,
    password2?: string,
    passwordMismatch?: boolean
}

export const Register: React.FC<RouteComponentProps> = ({history}) => {
    const {isAuthenticated, isAuthenticating, register, authenticationError} = useContext(AuthContext);
    const [state, setState] = useState<RegisterState>({passwordMismatch: false});
    const {username, password, password2, passwordMismatch} = state;
    const handleRegister = () => {
        logger("handleRegister...");

        if (password != password2)
            setState({...state, passwordMismatch: true});
            //register?.(username, password)
    }

    if (isAuthenticated) {
        return <Redirect to={{ pathname: '/' }} />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Register</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonInput placeholder={"Username"} value={username} onIonChange={e => setState({...state, username: e.detail.value || ''})} />
                <IonInput placeholder={"Password"} value={password} onIonChange={e => setState({...state, password: e.detail.value || ''})} />
                <IonInput placeholder={"Confirm Password"} value={password2} onIonChange={e => setState({...state, password2: e.detail.value || ''})} />

                {passwordMismatch && (
                    <div>The passwords do not match</div>
                )}

                <IonButton onClick={handleRegister}>Login</IonButton>
            </IonContent>
        </IonPage>
    )
}