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
import { add } from 'ionicons/icons';
import Listing from './Listing';
import { getLogger } from '../core';
import { ListingContext } from './ListingProvider';
import {useNetwork} from "./useNetwork";

const log = getLogger('ListingList');

const ListingList: React.FC<RouteComponentProps> = ({ history }) => {
  const { listings, fetching, fetchingError } = useContext(ListingContext);
  const {networkStatus} = useNetwork();

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
        {listings && (
          <IonList>
            {listings.map(({ id, text, title, price}) =>
              <Listing key={id} id={id} text={text} title={title} price={price} onEdit={id => history.push(`/item/${id}`)} />)}
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

export default ListingList;
