import React, {useContext, useState} from "react";
import {PlaceProps} from "./PlaceProps";
import {AuthContext} from "../authentication/AuthenticationProvider";
import {searchItems} from "./PlacesApi";
import {
    IonHeader,
    IonPage,
    IonToolbar,
    useIonViewWillEnter,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList, IonItemDivider, IonRow, IonCol, IonButtons, IonButton, IonIcon, IonAlert
} from "@ionic/react";
import {Place} from "./Place";
import {PlaceDetailsModal} from "./PlaceDetailsModal";
import {RouteComponentProps} from "react-router";
import {Plugins} from "@capacitor/core";
import {alert, logOut} from "ionicons/icons";
import {useNetwork} from "./useNetwork";

interface SearchPlacesState{
    items?: PlaceProps[],
}


export const SearchPlace: React.FC<RouteComponentProps> = ({history}) => {
    const [state, setState] = useState<SearchPlacesState>({});
    const [searchKey, setKey] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<PlaceProps>();
    const [openModal, setOpenModal] = useState(false);
    const {items} = state
    const {token, logout} = useContext(AuthContext);
    const {networkStatus} = useNetwork();


    const closeModal = () => {
        setOpenModal(false);
    }

    function logOutFunction(){
        logout?.();
        (async () => {
            const {Storage} = Plugins;
            await Storage.remove({key: 'token'});
        })()
    }

    async function fetchData(key: string){
        if (key){
            const response = await searchItems(token, key);
            setState({items: response});
        } else {
            setState({items: undefined})
        }
    }

    async function handleSearch(key: string){
        setKey(key);
        await fetchData(key);
    }

    useIonViewWillEnter(async () => {
        await fetchData('');
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle color={"primary"}>Search</IonTitle>

                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={() => {
                            logOutFunction();
                            history.push('/login')}}>
                            <IonIcon icon={logOut}/>
                        </IonButton>
                    </IonButtons>

                    <IonButtons slot="start" style={{'margin-left':'10px'}}>
                        {!networkStatus.connected && (
                            <IonIcon icon={alert}/>
                        )}
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <IonAlert
                    isOpen={!networkStatus.connected}
                    header={'Offline'}
                    message={'No internet connection.'}
                    buttons={['Dismiss']}
                />

                <IonSearchbar
                    value={searchKey}
                    onIonChange={e => handleSearch(e.detail.value||'')}
                >
                </IonSearchbar>

                {items && (
                    <IonItemDivider color={"light"}>Results: </IonItemDivider>
                )}

                {items && (
                    <IonRow>
                        {items.map((item) =>
                            <IonCol size-xs="12" size-sm="6" size-md="4" size-xl="3" onClick={() => {setSelectedPlace(item); setOpenModal(true);}}>
                                <Place key={item._id} _id={item._id} text={item.text} title={item.title} price={item.price} photoBase64Data={item.photoBase64Data} coordinates={item.coordinates}/>
                            </IonCol>)}
                    </IonRow>
                )}

                <PlaceDetailsModal handleCloseModal={closeModal} isVisible={openModal} place={selectedPlace}/>

            </IonContent>

        </IonPage>
    )
}