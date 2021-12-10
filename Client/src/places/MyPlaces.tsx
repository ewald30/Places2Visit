import React, {useContext, useEffect} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  createAnimation,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {add, alert, globe, infinite, logOut} from 'ionicons/icons';
import MyPlace from './MyPlace';
import { getLogger } from '../core';
import { PlaceContext } from './PlacesProvider';
import {useNetwork} from "./useNetwork";
import {Plugins} from "@capacitor/core";
import {AuthContext} from "../authentication/AuthenticationProvider";

const log = getLogger('MyPlaces');

const MyPlaces: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(PlaceContext);
  const {logout} = useContext(AuthContext);
  const {networkStatus} = useNetwork();

  useEffect(addNewPlaceAnimation, []);

  function logOutFunction(){
    log('logging out...');
    logout?.();
    (async () => {
      const {Storage} = Plugins;
      await Storage.remove({key: 'token'});
    })()
  }

  // function addNewPlaceAnimationBounce(){
  //   const element = document.querySelector('.add-new-Place-button');
  //   if (element){
  //     const animation = createAnimation()
  //         .addElement(element)
  //         .duration(1000)
  //         .iterations(1)
  //         .easing('cubic-bezier(0.42, 0, .3, 1)')
  //         .keyframes([
  //           {offset: 0, transform: 'translate3d(0, -1200px, 0)'},
  //           {offset: 1, transform: 'translate3d(0, 0px, 0)'}
  //         ])
  //     animation.play();
  //   }
  // }

  function addNewPlaceAnimation(){
    const element = document.querySelector('.add-new-Place-button');
    if (element){
      const animation = createAnimation()
          .addElement(element)
          .duration(600)
          .iterations(1)
          .easing('cubic-bezier(0.42, 0, .3, 1)')
          .keyframes([
            {offset: 0, transform: 'translate3d(80px, 0, 0)' + 'rotate(180deg)'},
            {offset: 1, transform: 'translate3d(0, 0, 0)'}
          ])
      animation.play();
    }
  }

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div>
            <IonTitle color={"primary"}>Home</IonTitle>
          </div>
          <IonButtons slot="end">
            <IonButton onClick={() => {
              logOutFunction();
              history.push('/login')}}>
              Log Out
            </IonButton>
            {!networkStatus.connected && (
                <IonIcon icon={alert}/>
            )}
            {networkStatus.connected && (
                <IonIcon icon={globe}/>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {items && (
          <IonList>
            {items.map(({ _id, text, title, price, photoBase64Data, coordinates}) =>
              <MyPlace key={_id} _id={_id} text={text} title={title} price={price} photoBase64Data={photoBase64Data} coordinates={coordinates} onEdit={id => history.push(`/item/${id}`)} />)}
          </IonList>
        )}

        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className={'add-new-Place-button'}>
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>

        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MyPlaces;
