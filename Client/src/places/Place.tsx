import React from "react";
import {IonItem, IonLabel} from "@ionic/react";
import {PlaceProps} from "./PlaceProps";

export const Place: React.FC<PlaceProps> = ({ _id, text, title, price}) => {
    return (
        <IonItem>
            <IonLabel>{title}</IonLabel>
            <IonLabel>{text}</IonLabel>
            <IonLabel>{price}</IonLabel>
        </IonItem>
    );
};