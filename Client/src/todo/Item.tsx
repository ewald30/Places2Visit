import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, title, price,onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(_id)}>
        <IonLabel>{title}</IonLabel>
        <IonLabel>{text}</IonLabel>
        <IonLabel>{price}</IonLabel>
    </IonItem>
  );
};

export default Item;
