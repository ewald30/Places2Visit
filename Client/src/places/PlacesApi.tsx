import axios from 'axios';
import {authConfig, getLogger, BASE_URL, withLogs, config} from '../core';
import { PlaceProps } from './PlaceProps';

const logger = getLogger('itemApi');

const Place_BASE_URL = `http://${BASE_URL}/api/item`;


export const getItems: (token:string) => Promise<PlaceProps[]> = token => {
  return withLogs(axios.get(Place_BASE_URL, authConfig(token)), 'getItems');
}

export const getItemsOffset: (token:string, offset: number, nbItems: number) => Promise<PlaceProps[]> = (token, offset, nbItems) => {
  return withLogs(axios.get(`${Place_BASE_URL}/offset/${offset}/${nbItems}`, authConfig(token)), 'getItemsOffset');
}

export const searchItems: (token: string, searchKey: string) => Promise<PlaceProps[]> = (token, searchKey) => {
  return withLogs(axios.get(`${Place_BASE_URL}/search/${searchKey}`, authConfig(token)), 'searchItems');
}

export const filterItemsPrice: (token: string, lowerLimit: number, upperLimit: number) => Promise<PlaceProps[]> = (token, lowerLimit, upperLimit) => {
  return withLogs(axios.get(`${Place_BASE_URL}/filter/${lowerLimit}/${upperLimit}`, authConfig(token)), 'filterItems');

}

export const createItem: (token: string, item: PlaceProps) => Promise<PlaceProps[]> = (token, item) => {
  return withLogs(axios.post(Place_BASE_URL, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: PlaceProps) => Promise<PlaceProps[]> = (token, item) => {
  return withLogs(axios.put(`${Place_BASE_URL}/${item._id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
  event: string;
  payload: {
    item: PlaceProps;
  };
}

export const newWebSocket = (token:string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${Place_BASE_URL}`)
  ws.onopen = () => {
    logger('web socket onopen');
    ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  };
  ws.onclose = () => {
    logger('web socket onclose');
  };
  ws.onerror = error => {
    logger('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    logger('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
