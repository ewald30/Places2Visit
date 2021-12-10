import React from 'react';
import {IonImg, IonItem, IonLabel} from '@ionic/react';
import {PlaceProps} from "./PlaceProps";

interface PlacePropsExt extends PlaceProps {
  onEdit: (_id?: string) => void;
}

const MyPlace: React.FC<PlacePropsExt> = ({ _id, text, title, price, photoBase64Data, coordinates,onEdit }) => {
  // @ts-ignore
    return (
    <IonItem onClick={() => onEdit(_id)}>
        <IonLabel>{title}</IonLabel>
        <IonLabel>{text}</IonLabel>
        <IonLabel>{price}</IonLabel>
        {photoBase64Data && <IonImg src={photoBase64Data}/>}
    </IonItem>
  );
};

export default MyPlace;
