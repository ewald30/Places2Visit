import React, {useContext, useState} from "react";
import {ListingsProps} from "./ListingsProps";
import {AuthContext} from "../authentication/AuthenticationProvider";
import {searchItems} from "./ListingsApi";
import {
    IonHeader,
    IonPage,
    IonToolbar,
    useIonViewWillEnter,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList, IonItemDivider
} from "@ionic/react";
import {Listing} from "./Listing";

interface SearchListingsState{
    items?: ListingsProps[],
}


export const SearchListings: React.FC = () => {
    const [state, setState] = useState<SearchListingsState>({});
    const [searchKey, setKey] = useState('');
    const {items} = state
    const {token} = useContext(AuthContext);

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
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonSearchbar
                    value={searchKey}
                    onIonChange={e => handleSearch(e.detail.value||'')}
                >
                </IonSearchbar>

                {items && (
                    <IonItemDivider color={"light"}>Results: </IonItemDivider>
                )}

                {items && (
                    <IonList>
                        {items.map(({ _id, text, title, price}) =>
                            <Listing key={_id} _id={_id} text={text} title={title} price={price}/>)}
                    </IonList>
                )}
            </IonContent>

        </IonPage>
    )
}