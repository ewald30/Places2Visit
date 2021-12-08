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
    IonList, IonItemDivider
} from "@ionic/react";
import {Place} from "./Place";
import {PlaceDetailsModal} from "./PlaceDetailsModal";

interface SearchPlacesState{
    items?: PlaceProps[],
}


export const SearchPlace: React.FC = () => {
    const [state, setState] = useState<SearchPlacesState>({});
    const [searchKey, setKey] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<PlaceProps>();
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
                            <div onClick={() => {setSelectedPlace(item); setOpenModal(true); console.log("asdasd")}}>
                                <Place key={item._id} _id={item._id} text={item.text} title={item.title} price={item.price} photoBase64Data={item.photoBase64Data}/>
                            </div>)}
                    </IonList>
                )}

                <PlaceDetailsModal handleCloseModal={closeModal} isVisible={openModal} place={selectedPlace}/>

            </IonContent>

        </IonPage>
    )
}