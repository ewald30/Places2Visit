import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ListingProps } from './ListingProps';

interface ItemPropsExt extends ListingProps {
  onEdit: (id?: string) => void;
}

const Listing: React.FC<ItemPropsExt> = ({ id, text, title, price,onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
        <IonLabel>{title}</IonLabel>
        <IonLabel>{text}</IonLabel>
        <IonLabel>{price}</IonLabel>
    </IonItem>
  );
};

export default Listing;
