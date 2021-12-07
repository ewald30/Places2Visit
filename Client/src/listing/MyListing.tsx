import React from 'react';
import {IonImg, IonItem, IonLabel} from '@ionic/react';
import {ListingsProps} from "./ListingsProps";

interface ListingsPropsExt extends ListingsProps {
  onEdit: (_id?: string) => void;
}

const MyListing: React.FC<ListingsPropsExt> = ({ _id, text, title, price, photoBase64Data,onEdit }) => {
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

export default MyListing;
