import React, { useContext, useEffect, useState } from 'react';
import {
  createAnimation,
  IonActionSheet,
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
import { PlaceContext } from './PlacesProvider';
import { RouteComponentProps } from 'react-router';
import { PlaceProps } from './PlaceProps';
import {camera, trash, closeCircle} from "ionicons/icons";
import {Photo, usePhotoGallery} from "../photos/usePhotoGallery";
import {useLocation} from "../map/useLocation";
import {Map} from "../map/Map";
import {Geolocation} from "@capacitor/core";

const log = getLogger('PlaceEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const PlaceEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const {photos, takePhoto, deletePhoto} = usePhotoGallery();
  const myLocation  = useLocation();
  const { items, saving, savingError, saveItem } = useContext(PlaceContext);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [item, setItem] = useState<PlaceProps>();
  const [photoBase64Data, setPhoto] = useState('');
  const [photoToDelete, setPhotoToDelete] = useState('');
  const { latitude: latitude, longitude: longitude } = myLocation.position?.coords || {}
  const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (latitude && longitude)
      setCoordinates({lat: latitude, lng: longitude});

    if (item) {
      console.log("item coordinates", coordinates)
      setText(item.text);
      setTitle(item.title);
      setPrice(item.price);
      setPhoto(item.photoBase64Data);
      if (item.coordinates)
        setCoordinates(item.coordinates);
    }
  }, [match.params.id, items, latitude, longitude]);


  useEffect(saveButtonAnimation, []);
  useEffect(addPhotoButtonAnimation, []);

  const handleSave = () => {
    const editedItem = item ? { ...item, text, title, price, photoBase64Data, coordinates } : { text, title, price, photoBase64Data, coordinates };
    saveItem && saveItem(editedItem).then(() => history.push('/my_items'));
  };

  const handleTakePhoto = async () => {
    const takenPhoto = await takePhoto()
    debugger;
    setPhoto(takenPhoto);
  }

  function saveButtonAnimation() {
    const element = document.querySelector('.save-btn');
    if (element){
      const animation = createAnimation()
          .addElement(element)
          .duration(1000)
          .iterations(Infinity)
          .keyframes([
            { offset: 0, opacity: '.5'},
            { offset: .5, opacity: '1'},
            { offset: 1, opacity: '.5'},
          ]);
      animation.play();
    }
  }

  function addPhotoButtonAnimation() {
    const element = document.querySelector('.add-photo-btn');
    if (element){
      const animation = createAnimation()
          .addElement(element)
          .duration(600)
          .iterations(1)
          .easing('cubic-bezier(0.42, 0, .3, 1)')
          .keyframes([
            {offset: 0, transform: 'translate3d(0, 60px, 0)'},
            {offset: 1, transform: 'translate3d(0, 0, 0)'}
          ])
      animation.play();
    }
  }

  log('render');
  // @ts-ignore
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color={"primary"}>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} className={'save-btn'}>
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

        {coordinates && (coordinates.lat && coordinates.lng &&
              <Map
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  onMapClick={updateCoords('onMap')}
                  onMarkerClick={updateCoords('onMarker')}
              />)}

          {photoBase64Data &&
          <IonItem>
              <IonImg src={photoBase64Data} onClick={() => {setPhotoToDelete(photoBase64Data)}}/>
          </IonItem>}

        <IonFab vertical={"bottom"} horizontal={"center"} slot={"fixed"} className={'add-photo-btn'}>
            <IonFabButton onClick={handleTakePhoto}>
                <IonIcon icon={camera}/>
            </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={photoToDelete !== ''}
          buttons={[{
          text: 'Delete',
          role: 'destructive',
          icon: trash,
          handler: () => {
            if (photoToDelete) {
              setPhoto('');
              setPhotoToDelete('');
            }
          }
        }, {
          text: 'Cancel',
          icon: closeCircle,
          role: 'cancel'
        }]}
          onDidDismiss={() => setPhotoToDelete('')}>

        </IonActionSheet>

        <IonLoading isOpen={saving} />
        {savingError && (<div>{savingError.message || 'Failed to save item'}</div>)}
      </IonContent>

    </IonPage>
  );

  function updateCoords(source: string) {
    return (e: any) => {
      setCoordinates({lat: e.latLng.lat(), lng: e.latLng.lng()});
      console.log(source, e.latLng.lat(), e.latLng.lng());
    }
  }

};

export default PlaceEdit;
