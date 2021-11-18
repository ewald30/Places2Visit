import axios from 'axios';
import {authConfig, getLogger, BASE_URL, withLogs} from '../core';
import { ItemProps } from './ItemProps';

const logger = getLogger('itemApi');

const itemUrl = `http://${BASE_URL}/api/item`;


export const getItems: (token:string) => Promise<ItemProps[]> = token => {
  return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
  event: string;
  payload: {
    item: ItemProps;
  };
}

export const newWebSocket = (token:string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${BASE_URL}`)
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
