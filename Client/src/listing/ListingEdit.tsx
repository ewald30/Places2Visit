import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonImg,
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
import {camera} from "ionicons/icons";
import {Photo, usePhotoGallery} from "../photos/usePhotoGallery";

const log = getLogger('ListingEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ListingEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const {photos, takePhoto, deletePhoto} = usePhotoGallery();
  const { items, saving, savingError, saveItem } = useContext(ListingContext);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState<ListingsProps>();
  const [photoBase64Data, setPhoto] = useState('');

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
      setTitle(item.title);
      setPrice(item.price);
      setPhoto(item.photoBase64Data);
    }
  }, [match.params.id, items]);

  const handleSave = () => {
    const editedItem = item ? { ...item, text, title, price, photoBase64Data } : { text, title, price, photoBase64Data };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

  const handleTakePhoto = async () => {
    const takenPhoto = await takePhoto()
    debugger;
    setPhoto(takenPhoto);
  }

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

          {photoBase64Data &&
          <IonItem>
              <IonImg src={photoBase64Data}/>
          </IonItem>}

        <IonFab vertical={"bottom"} horizontal={"center"} slot={"fixed"}>
            <IonFabButton onClick={handleTakePhoto}>
                <IonIcon icon={camera}/>
            </IonFabButton>
        </IonFab>

        <IonLoading isOpen={saving} />
        {savingError && (<div>{savingError.message || 'Failed to save item'}</div>)}
      </IonContent>

    </IonPage>
  );
};

export default ListingEdit;
