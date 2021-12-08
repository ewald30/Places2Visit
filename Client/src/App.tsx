import React, {useContext, useEffect} from 'react';
import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonTabs} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ItemEdit, ItemList } from './places';

/* Core CSS required for Ionic places to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { PlacesProvider } from './places/PlacesProvider';
import {useNetwork} from "./places/useNetwork";
import {AuthContext, AuthProvider, AuthState} from "./authentication/AuthenticationProvider";
import {Login} from "./authentication/LoginComponent";
import {PrivateRoute} from "./authentication/PrivateRoute";
import {Register} from "./authentication/RegisterComponent";
import {
    ellipse,
    search,
    cashOutline,
    personAdd,
    person,
    filter,
    basket,
    home,
    map,
    globe,
    globeOutline, globeSharp, planet, earth
} from "ionicons/icons";
import {login} from "./authentication/api";
import {AllPlaces} from "./places/AllPlaces";
import {SearchPlace} from "./places/SearchPlace";
import {FilterPlaces} from "./places/FilterPlaces";


const App: React.FC = () => {
    const {networkStatus} = useNetwork()
    console.log("NETWORK STATUS: ", networkStatus)

    return (<IonApp>

        <IonReactRouter>
            <IonTabs>

                <IonRouterOutlet>
                    <AuthProvider>
                        <Route path="/login" component={Login} exact={true}/>
                        <Route path="/register" component={Register} exact={true}/>
                        <PlacesProvider>
                            <PrivateRoute path="/my_items" component={ItemList} exact={true}/>
                            <PrivateRoute path="/all_items" component={AllPlaces} exact={true}/>
                            <PrivateRoute path="/search_items" component={SearchPlace} exact={true}/>
                            <PrivateRoute path="/filter_items" component={FilterPlaces} exact={true}/>
                            <PrivateRoute path="/item" component={ItemEdit} exact={true}/>
                            <PrivateRoute path="/item/:id" component={ItemEdit} exact={true}/>
                        </PlacesProvider>
                        <Route exact path="/" render={() => <Redirect to="/my_items"/>}/>
                    </AuthProvider>

                </IonRouterOutlet>
                <IonTabBar slot={"bottom"}>
                    <IonTabButton tab={"tab1"} href={"/my_items"}>
                        <IonIcon icon={home} />
                        <IonLabel>Home</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab={"tab3"} href={"/search_items"}>
                        <IonIcon icon={search}/>
                        <IonLabel>Search</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab={"tab4"} href={"/filter_items"}>
                        <IonIcon icon={filter}/>
                        <IonLabel>Filter</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab={"tab2"} href={"/all_items"}>
                        <IonIcon icon={earth}/>
                        <IonLabel>Explore</IonLabel>
                    </IonTabButton>

                    {/*<IonTabButton tab={"tab5"} href={"/login"}>*/}
                    {/*    <IonIcon icon={person}/>*/}
                    {/*    <IonLabel>Log in</IonLabel>*/}
                    {/*</IonTabButton>*/}

                    {/*<IonTabButton tab={"tab6"} href={"/register"}>*/}
                    {/*    <IonIcon icon={personAdd}/>*/}
                    {/*    <IonLabel>Sign up</IonLabel>*/}
                    {/*</IonTabButton>*/}


                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    </IonApp>
)};

export default App;
