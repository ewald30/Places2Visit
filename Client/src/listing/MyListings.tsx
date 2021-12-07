import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
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
import {add, alert, globe, logOut} from 'ionicons/icons';
import MyListing from './MyListing';
import { getLogger } from '../core';
import { ListingContext } from './ListingsProvider';
import {useNetwork} from "./useNetwork";
import {Plugins} from "@capacitor/core";
import {AuthContext} from "../authentication/AuthenticationProvider";

const log = getLogger('MyListings');

const MyListings: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ListingContext);
  const {logout} = useContext(AuthContext);
  const {networkStatus} = useNetwork();

  function logOutFunction(){
    log('logging out...');
    logout?.();
    (async () => {
      const {Storage} = Plugins;
      await Storage.remove({key: 'token'});
    })()
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
            {items.map(({ _id, text, title, price, photoBase64Data}) =>
              <MyListing key={_id} _id={_id} text={text} title={title} price={price} photoBase64Data={photoBase64Data} onEdit={id => history.push(`/item/${id}`)} />)}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>

        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MyListings;
