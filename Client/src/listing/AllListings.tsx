import React, {useContext, useState} from "react";
import {ListingsProps} from "./ListingsProps";
import {getItemsOffset} from "./ListingsApi";
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
import {Listing} from "./Listing";
import {useNetwork} from "./useNetwork";
import {alert} from "ionicons/icons";
import {ViewListingDetailsModal} from "./ViewListingDetailsModal";

const ELEMENTS_TO_SHOW = 4;

interface ListingMarketState{
    items?: ListingsProps[],
    currentOffset: number
}
const initialState : ListingMarketState = {
    currentOffset: 0
}
export const AllListings: React.FC = () => {
    const [state, setState] = useState(initialState);
    const [selectedListing, setSelectedListing] = useState<ListingsProps>();
    const [openModal, setOpenModal] = useState(false);
    const {currentOffset, items} = state
    const {token} = useContext(AuthContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const {networkStatus} = useNetwork();

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
                    <IonTitle color={"primary"}>Browse</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {items && (
                    <IonList>
                        {items.map((item) =>
                            <div onClick={() => {setSelectedListing(item); setOpenModal(true); console.log("asdasd")}}>
                                <Listing key={item._id} _id={item._id} text={item.text} title={item.title} price={item.price} photoBase64Data={item.photoBase64Data}/>
                            </div>)}
                    </IonList>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => getNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more good doggos...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                <ViewListingDetailsModal handleCloseModal={closeModal} isVisible={openModal} listing={selectedListing}/>

            </IonContent>

        </IonPage>
    )

}