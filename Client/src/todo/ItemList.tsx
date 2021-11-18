import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
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
import {add, logOut} from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import {useNetwork} from "./useNetwork";
import {Plugins} from "@capacitor/core";
import {AuthContext} from "../authentication/AuthenticationProvider";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
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
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {items && (
          <IonList>
            {items.map(({ _id, text, title, price}) =>
              <Item key={_id} _id={_id} text={text} title={title} price={price} onEdit={id => history.push(`/item/${id}`)} />)}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>

          <IonFabButton onClick={() => {
            logOutFunction();
            history.push('/login')}}>
            <IonIcon icon={logOut} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
