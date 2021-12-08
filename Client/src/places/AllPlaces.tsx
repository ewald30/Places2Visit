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
    IonInfiniteScroll, IonInfiniteScrollContent, IonIcon
} from "@ionic/react";
import {AuthContext} from "../authentication/AuthenticationProvider";
import {Place} from "./Place";
import {useNetwork} from "./useNetwork";
import {alert} from "ionicons/icons";
import {PlaceDetailsModal} from "./PlaceDetailsModal";

const ELEMENTS_TO_SHOW = 4;

interface PlaceMarketState{
    items?: PlaceProps[],
    currentOffset: number
}
const initialState : PlaceMarketState = {
    currentOffset: 0
}
export const AllPlaces: React.FC = () => {
    const [state, setState] = useState(initialState);
    const [selectedPlace, setSelectedPlace] = useState<PlaceProps>();
    const [openModal, setOpenModal] = useState(false);
    const {currentOffset, items} = state
    const {token} = useContext(AuthContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

    const closeModal = () => {
        setOpenModal(false);
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
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {items && (
                    <IonList>
                        {items.map((item) =>
                            <div onClick={() => {setSelectedPlace(item); setOpenModal(true); console.log("asdasd")}}>
                                <Place key={item._id} _id={item._id} text={item.text} title={item.title} price={item.price} photoBase64Data={item.photoBase64Data}/>
                            </div>)}
                    </IonList>
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