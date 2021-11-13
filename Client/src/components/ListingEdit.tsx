import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput, IonItemDivider,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ListingContext } from './ListingProvider';
import { RouteComponentProps } from 'react-router';
import { ListingProps } from './ListingProps';

const log = getLogger('ListingEdit');

interface ListingEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ListingEdit: React.FC<ListingEditProps> = ({ history, match }) => {
  const { listings, saving, savingError, saveItem } = useContext(ListingContext);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState<ListingProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = listings?.find(it => it.id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
    }
  }, [match.params.id, listings]);
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
        <IonInput value={title} placeholder={"Title: "} onIonChange={e => setTitle(e.detail.value || '')} />
        <IonInput value={text} placeholder={"Description: "} onIonChange={e => setText(e.detail.value || '')} />
        <IonInput type="number" value={price} placeholder={"Price: "} onIonChange={e => {
          console.log("val: ", e.detail.value); setPrice(parseInt(e.detail.value!))}} />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ListingEdit;
