import {getLogger} from "../core";
import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonLoading,
    IonButton,
    IonButtons, IonGrid, IonRow, IonCol
} from "@ionic/react";
import {AuthContext} from "./AuthenticationProvider";
import {Redirect} from "react-router-dom";
import LOGO from '../assets/default.svg'


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
                    <IonTitle color={"primary"}>Login</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color={'medium'} onClick={() => {
                            history.push('/register')}}>
                            Register
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
                    <IonCol  size={"6"} className="ion-align-items-center">
                            <img src={LOGO}/>

                            <IonInput placeholder="Username" value={username} onIonChange={e => setState({...state, username: e.detail.value || ''})}/>
                            <IonInput type={"password"} placeholder="Password" value={password} onIonChange={e => setState({...state, password: e.detail.value || ''})}/>
                            <IonLoading isOpen={isAuthenticating}/>

                            {authenticationError && (
                                <div>{authenticationError.message || 'Failed to authenticate'}</div>
                            )}

                            <IonButton style={{"width":"100%"}}
                                onClick={handleLogin}>Login</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
}