import React from 'react';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg, IonItem, IonLabel} from '@ionic/react';
import {PlaceProps} from "./PlaceProps";

interface PlacePropsExt extends PlaceProps {
  onEdit: (_id?: string) => void;
}

const MyPlace: React.FC<PlacePropsExt> = ({ _id, text, title, price, photoBase64Data, coordinates,onEdit }) => {
  // @ts-ignore
    return (
    <IonCard onClick={() => onEdit(_id)}>

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

export default MyPlace;
