import React, {useContext, useEffect, useState} from "react";
import {PlaceProps} from "./PlaceProps";
import {AuthContext} from "../authentication/AuthenticationProvider";
import {filterItemsPrice, searchItems} from "./PlacesApi";
import {
    createAnimation, IonButton, IonButtons, IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput, IonItem, IonItemDivider, IonLabel, IonList,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {checkboxOutline, closeOutline, closeSharp, logOut} from "ionicons/icons";
import {Place} from "./Place";
import {PlaceDetailsModal} from "./PlaceDetailsModal";
import {Plugins} from "@capacitor/core";
import {RouteComponentProps} from "react-router";

interface FilterPlacesInterface {
    items? : PlaceProps[]
}

export const FilterPlaces: React.FC<RouteComponentProps> = ({history}) => {
    const [state, setState] = useState<FilterPlacesInterface>({});
    const [lowerLimit, setLowerLimit] = useState<number>(0);
    const [upperLimit, setUpperLimit] = useState<number>(0);
    const [selectedPlace, setSelectedPlace] = useState<PlaceProps>();
    const [openModal, setOpenModal] = useState(false);
    const {items} = state
    const {token, logout} = useContext(AuthContext);

    useEffect(submitFilterAnimation, []);
    useEffect(cancelFilterAnimation, [items]);

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

    async function fetchData(){
        if (lowerLimit === 0 && upperLimit === 0){
            setState({items: []})
        } else {
            const response = await filterItemsPrice(token, lowerLimit, upperLimit);
            setState({items: response});
        }
    }

    function submitFilterAnimation(){
        const element = document.querySelector('.submit-filter-btn');
        if (element){
            const animation = createAnimation()
                .addElement(element)
                .duration(1000)
                .iterations(1)
                .easing('cubic-bezier(0.42, 0, .3, 1)')
                .keyframes([
                    {offset: 0, transform: 'translate3d(80px, 0, 0)' + 'rotate(180deg)'},
                    {offset: 1, transform: 'translate3d(0, 0, 0)'}
                ])
            animation.play();
        }
    }

    function cancelFilterAnimation(){
        const element = document.querySelector('.cancel-filter-btn');
        if (element){
            const animation = createAnimation()
                .addElement(element)
                .duration(2000)
                .iterations(1)
                .easing('cubic-bezier(0.42, 0, .3, 1)')
                .keyframes([
                    {offset: 0, transform: 'translate3d(-80px, 0, 0)' + 'rotate(-180deg)'},
                    {offset: 1, transform: 'translate3d(0, 0, 0)'}
                ])
            animation.play();
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle color={"primary"}>Filter</IonTitle>

                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={() => {
                            logOutFunction();
                            history.push('/login')}}>
                            <IonIcon icon={logOut}/>
                        </IonButton>
                    </IonButtons>

                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>

                <IonItem>
                    <IonLabel>Lower limit: </IonLabel>
                    <IonInput value={lowerLimit} type={"number"} placeholder={"Enter price"} onIonChange={e => setLowerLimit(parseInt(e.detail.value!))}/>
                </IonItem>

                <IonItem>
                    <IonLabel>Upper limit</IonLabel>
                    <IonInput value={upperLimit} type={"number"} placeholder={"Enter price"} onIonChange={e => setUpperLimit(parseInt(e.detail.value!))}/>
                </IonItem>

                <IonFab vertical="bottom" horizontal="end" slot="fixed" className={'submit-filter-btn'}>
                    <IonFabButton onClick={() => {
                        fetchData();
                    }}>
                        <IonIcon icon={checkboxOutline} />
                    </IonFabButton>
                </IonFab>

                {items && (
                    <IonItemDivider color={"light"}>Results: </IonItemDivider>
                )}


                {items && (
                    <IonFab vertical="bottom" horizontal="start" slot="fixed" className={'cancel-filter-btn'}>
                        <IonFabButton color={"danger"} onClick={() => {
                            setState({items: undefined})
                        }}>
                            <IonIcon icon={closeOutline} />
                        </IonFabButton>
                    </IonFab>
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