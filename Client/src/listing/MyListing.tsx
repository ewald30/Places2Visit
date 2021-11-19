import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import {ListingsProps} from "./ListingsProps";

interface ListingsPropsExt extends ListingsProps {
  onEdit: (_id?: string) => void;
}

const MyListing: React.FC<ListingsPropsExt> = ({ _id, text, title, price,onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(_id)}>
        <IonLabel>{title}</IonLabel>
        <IonLabel>{text}</IonLabel>
        <IonLabel>{price}</IonLabel>
    </IonItem>
  );
};

export default MyListing;
