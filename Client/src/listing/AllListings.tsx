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
    const {currentOffset, items} = state
    const {token} = useContext(AuthContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const {networkStatus} = useNetwork();

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
                        {items.map(({ _id, text, title, price, photoBase64Data}) =>
                            <Listing key={_id} _id={_id} text={text} title={title} price={price} photoBase64Data={photoBase64Data}/>)}
                    </IonList>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => getNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more good doggos...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

            </IonContent>

        </IonPage>
    )

}