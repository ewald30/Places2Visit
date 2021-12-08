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
import {ViewListingDetailsModal} from "./ViewListingDetailsModal";

interface SearchListingsState{
    items?: ListingsProps[],
}


export const SearchListings: React.FC = () => {
    const [state, setState] = useState<SearchListingsState>({});
    const [searchKey, setKey] = useState('');
    const [selectedListing, setSelectedListing] = useState<ListingsProps>();
    const [openModal, setOpenModal] = useState(false);
    const {items} = state
    const {token} = useContext(AuthContext);

    const closeModal = () => {
        setOpenModal(false);
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
                        {items.map((item) =>
                            <div onClick={() => {setSelectedListing(item); setOpenModal(true); console.log("asdasd")}}>
                                <Listing key={item._id} _id={item._id} text={item.text} title={item.title} price={item.price} photoBase64Data={item.photoBase64Data}/>
                            </div>)}
                    </IonList>
                )}

                <ViewListingDetailsModal handleCloseModal={closeModal} isVisible={openModal} listing={selectedListing}/>

            </IonContent>

        </IonPage>
    )
}