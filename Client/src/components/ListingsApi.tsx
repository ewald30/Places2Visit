import axios from 'axios';
import {authConfig, getLogger, BASE_URL, withLogs, config} from '../core';
import { ListingsProps } from './ListingsProps';

const logger = getLogger('itemApi');

const LISTING_BASE_URL = `http://${BASE_URL}/api/item`;


export const getItems: (token:string) => Promise<ListingsProps[]> = token => {
  return withLogs(axios.get(LISTING_BASE_URL, authConfig(token)), 'getItems');
}

export const getItemsOffset: (token:string, offset: number, nbItems: number) => Promise<ListingsProps[]> = (token, offset, nbItems) => {
  return withLogs(axios.get(`${LISTING_BASE_URL}/offset/${offset}/${nbItems}`, authConfig(token)), 'getItemsOffset');
}

export const searchItems: (token: string, searchKey: string) => Promise<ListingsProps[]> = (token, searchKey) => {
  return withLogs(axios.get(`${LISTING_BASE_URL}/search/${searchKey}`, authConfig(token)), 'searchItems');
}

export const filterItemsPrice: (token: string, lowerLimit: number, upperLimit: number) => Promise<ListingsProps[]> = (token, lowerLimit, upperLimit) => {
  return withLogs(axios.get(`${LISTING_BASE_URL}/filter/${lowerLimit}/${upperLimit}`, authConfig(token)), 'filterItems');

}

export const createItem: (token: string, item: ListingsProps) => Promise<ListingsProps[]> = (token, item) => {
  return withLogs(axios.post(LISTING_BASE_URL, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: ListingsProps) => Promise<ListingsProps[]> = (token, item) => {
  return withLogs(axios.put(`${LISTING_BASE_URL}/${item._id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
  event: string;
  payload: {
    item: ListingsProps;
  };
}

export const newWebSocket = (token:string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${LISTING_BASE_URL}`)
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
