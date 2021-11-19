import React, {useContext, useState} from "react";
import {ListingsProps} from "./ListingsProps";
import {AuthContext} from "../authentication/AuthenticationProvider";
import {filterItemsPrice, searchItems} from "./ListingsApi";
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput, IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {checkboxOutline, closeSharp} from "ionicons/icons";
import {Listing} from "./Listing";

interface FilterListings{
    items? : ListingsProps[]
}

export const FilterListings: React.FC = () => {
    const [state, setState] = useState<FilterListings>({});
    const [lowerLimit, setLowerLimit] = useState(0);
    const [upperLimit, setUpperLimit] = useState(0);
    const {items} = state
    const {token} = useContext(AuthContext);

    async function fetchData(){
        if (lowerLimit === 0 && upperLimit === 0){
            setState({items: []})
        } else {
            const response = await filterItemsPrice(token, lowerLimit, upperLimit);
            setState({items: response});
        }
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Filter Listings by price</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonInput value={lowerLimit} type={"number"} placeholder={"Lower limit: "} onIonChange={e => setLowerLimit(parseInt(e.detail.value!))}/>
                <IonInput value={upperLimit} type={"number"} placeholder={"Upper limit: "} onIonChange={e => setUpperLimit(parseInt(e.detail.value!))}/>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => {
                        fetchData();
                    }}>
                        <IonIcon icon={checkboxOutline} />
                    </IonFabButton>
                </IonFab>

                {items && (
                    <IonFab vertical="bottom" horizontal="start" slot="fixed">
                        <IonFabButton color={"light"} onClick={() => {
                            setState({items: []})
                        }}>
                            <IonIcon icon={closeSharp} />
                        </IonFabButton>
                    </IonFab>
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