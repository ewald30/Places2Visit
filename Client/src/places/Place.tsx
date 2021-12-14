import React from "react";
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg, IonItem, IonLabel} from "@ionic/react";
import {PlaceProps} from "./PlaceProps";

export const Place: React.FC<PlaceProps> = ({ _id, text, title, price,photoBase64Data}) => {
    return (
        <IonCard>

            {photoBase64Data &&
            <IonCardHeader>
                <IonImg src={photoBase64Data}/>
            </IonCardHeader>
            }

            <IonCardContent>
                <IonCardTitle>
                    <IonLabel>{title}</IonLabel>
                </IonCardTitle>

                <IonLabel>Description: {text.length > 200? text.substr(0, 150) + "..." : text}</IonLabel>
                <br/>
                <IonLabel>Ticket price {price}</IonLabel>
            </IonCardContent>
        </IonCard>
    );
};