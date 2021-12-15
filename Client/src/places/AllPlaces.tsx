import React, {useContext, useState} from "react";
import {PlaceProps} from "./PlaceProps";
import {getItemsOffset} from "./PlacesApi";
import {
    IonHeader,
    IonPage,
    useIonViewWillEnter,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonInfiniteScroll, IonInfiniteScrollContent, IonIcon, IonRow, IonCol, IonButtons, IonButton, IonAlert
} from "@ionic/react";
import {AuthContext} from "../authentication/AuthenticationProvider";
import {Place} from "./Place";
import {useNetwork} from "./useNetwork";
import {alert, logOut} from "ionicons/icons";
import {PlaceDetailsModal} from "./PlaceDetailsModal";
import {Plugins} from "@capacitor/core";
import {RouteComponentProps} from "react-router";

const ELEMENTS_TO_SHOW = 4;

interface PlaceMarketState{
    items?: PlaceProps[],
    currentOffset: number
}
const initialState : PlaceMarketState = {
    currentOffset: 0
}
export const AllPlaces: React.FC<RouteComponentProps> = ({history}) => {
    const [state, setState] = useState(initialState);
    const [selectedPlace, setSelectedPlace] = useState<PlaceProps>();
    const [openModal, setOpenModal] = useState(false);
    const {currentOffset, items} = state
    const {token, logout} = useContext(AuthContext);
    const {networkStatus} = useNetwork();

    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

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

    async function fetchData(offset: number, howMany: number) {
        const response = await getItemsOffset(token, offset, howMany)
        let fullItems= [];
        if (items)
            fullItems = items?.concat(response);
        else
            fullItems = response;
        setState({currentOffset: offset, items: fullItems})

    }

    useIonViewWillEnter(async () => {
        await fetchData(0, 11);
    });

    async function getNext($event: CustomEvent<void>) {
        await fetchData(currentOffset + ELEMENTS_TO_SHOW, ELEMENTS_TO_SHOW);
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle color={"primary"}>Explore locations</IonTitle>

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

                {items && (
                    <IonRow>
                        {items.map((item) =>
                            <IonCol size-xs="12" size-sm="6" size-md="4" size-xl="3" onClick={() => {setSelectedPlace(item); setOpenModal(true);}}>
                                <Place key={item._id} _id={item._id} text={item.text} title={item.title} price={item.price} photoBase64Data={item.photoBase64Data} coordinates={item.coordinates}/>
                            </IonCol>)}
                    </IonRow>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => getNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more good doggos...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                <PlaceDetailsModal handleCloseModal={closeModal} isVisible={openModal} place={selectedPlace}/>

            </IonContent>
        </IonPage>
    )

}