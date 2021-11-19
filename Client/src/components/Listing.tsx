import React from "react";
import {IonItem, IonLabel} from "@ionic/react";
import {ListingsProps} from "./ListingsProps";

export const Listing: React.FC<ListingsProps> = ({ _id, text, title, price}) => {
    return (
        <IonItem>
            <IonLabel>{title}</IonLabel>
            <IonLabel>{text}</IonLabel>
            <IonLabel>{price}</IonLabel>
        </IonItem>
    );
};