import {getLogger} from "../core";
import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";
import {AuthContext} from "./AuthenticationProvider";
import {Redirect} from "react-router-dom";
import {
    IonButton,
    IonButtons, IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import LOGO from "../assets/default.svg";


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

        if (password != password2){
            setState({...state, passwordMismatch: true});
            return
        }

        register?.(username, password)
    }

    if (isAuthenticated) {
        return <Redirect to={{ pathname: '/' }} />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle color={"primary"}>Register</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color={'medium'} onClick={() => {
                            history.push('/login')}}>
                            Log in
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonGrid fixed={true}>
                <IonRow>
                    <IonCol/>
                </IonRow>
                <IonRow>
                    <IonCol/>
                </IonRow>

                <IonRow>
                    <IonCol size={"3"}/>
                    <IonCol size={"6"} className="ion-align-items-center">
                        <img src={LOGO}/>

                        <IonInput placeholder="Username" value={username} onIonChange={e => setState({...state, username: e.detail.value || ''})}/>
                        <IonInput type={"password"} placeholder={"Password"} value={password} onIonChange={e => setState({...state, password: e.detail.value || ''})} />
                        <IonInput type={"password"} placeholder={"Confirm Password"} value={password2} onIonChange={e => setState({...state, password2: e.detail.value || ''})} />

                        {passwordMismatch && (
                            <div>The passwords do not match</div>
                        )}

                        {authenticationError && (
                            <div>{authenticationError.message || 'Failed to authenticate'}</div>
                        )}

                        <IonButton style={{"width":"100%"}}
                            onClick={handleRegister}>Register</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    )
}