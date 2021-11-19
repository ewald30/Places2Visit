import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput, IonItem, IonItemDivider, IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ListingContext } from './ListingsProvider';
import { RouteComponentProps } from 'react-router';
import { ListingsProps } from './ListingsProps';

const log = getLogger('ListingEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ListingEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ListingContext);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState<ListingsProps>();

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
    }
  }, [match.params.id, items]);

  const handleSave = () => {
    const editedItem = item ? { ...item, text, title, price } : { text, title, price };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonItem>
          <IonLabel>Title: </IonLabel>
          <IonInput value={title} placeholder={"Title: "} onIonChange={e => setTitle(e.detail.value || '')} />
        </IonItem>
        <IonItem>
          <IonLabel>Description: </IonLabel>
          <IonInput value={text} placeholder={"Description: "} onIonChange={e => setText(e.detail.value || '')} />
        </IonItem>
        <IonItem>
          <IonLabel>Price: </IonLabel>
          <IonInput type="number" value={price} placeholder={"Price: "} onIonChange={e => {setPrice(parseInt(e.detail.value!))}} />
        </IonItem>
        <IonLoading isOpen={saving} />
        {savingError && (<div>{savingError.message || 'Failed to save item'}</div>)}
      </IonContent>

    </IonPage>
  );
};

export default ListingEdit;
