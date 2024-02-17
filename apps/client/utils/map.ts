import axios, { AxiosResponse } from 'axios';
import { LogisticServiceListItem } from './axios/models/logistic';

const API_KEY = process.env.MYPTV_API_KEY;
const SEARCH_TEXT_URL = process.env.MYPTV_SEARCH_TEXT_URL;
const WAY_POINTS_URL = process.env.MYPTV_WAY_POINTS_URL;
const WAY_POINTS_SEARCH_PREFIX = process.env.MYPTV_WAY_POINTS_SEARCH_PREFIX;
const FULFILLED_STATUS = process.env.MYPTV_FULFILLED_STATUS;
const UNKNOWN_ADDRESS = process.env.MYPTV_UNKNOWN_ADDRESS;
const MAP_STYLE_URL = process.env.MYPTV_MAP_STYLE_URL;
const MAP_TILE_URL = process.env.MYPTV_MAP_TILE_URL;

export const getTransformRequest = (url, resourceType) => {
  if (resourceType === 'Tile') {
    return { url, headers: { ApiKey: API_KEY } };
  }

  return { url, headers: {} };
};

export const initialMapStyle = {
  version: 8,
  name: 'initial',
  sources: {
    ptv: {
      type: 'vector',
      tiles: [
        MAP_TILE_URL,
      ],
    },
  },
  layers: [],
};

export const initViewport = {
  longitude: 4.303100109100342,
  latitude: 52.057559967041016,
  zoom: 9,
};

export const getMapStyle = () => fetch(MAP_STYLE_URL)
  .then((result) => result.json())
  .then((mapStyle) => {
    mapStyle.sources.ptv.tiles = [MAP_TILE_URL];
    return mapStyle;
  });
export interface LogisticWay extends Way {
  logisticService?: LogisticServiceListItem,
}

export interface Way {
  address?: string,
  position?: { latitude: number, longitude: number }
}

export async function fetchWayForLogisticService(logisticServiceItem: LogisticServiceListItem): Promise<LogisticWay> {
  const { supplier, customer } = logisticServiceItem.order;
  const contact = supplier || customer;

  const address = `${contact.street}, ${contact.zip}, ${contact.city}, ${contact.state}, ${contact.country}`;
  const result = await axios.get(`${SEARCH_TEXT_URL}${address}`, { headers: { apiKey: API_KEY } });

  return {
    logisticService: logisticServiceItem,
    position: result.data.locations[0].referencePosition,
    address: result.data.locations[0].formattedAddress,
  };
}

export async function fetchWayForLogisticServices(logisticServices: LogisticServiceListItem[]): Promise<LogisticWay[]> {
  const result = await Promise.allSettled(
    logisticServices.map((element: LogisticServiceListItem) => element && fetchWayForLogisticService(element)),
  );

  const fulfilled = result.filter(({ status }) => status == FULFILLED_STATUS) as PromiseFulfilledResult<AxiosResponse>[];

  const ways = fulfilled.map(({ value }) => value) as LogisticWay[];

  return ways.filter((way) => way.address != UNKNOWN_ADDRESS);
}

export async function fetchPolylineInfo(ways: Way[]): Promise<{ coordinates: [], travelTime: number }> {
  const url = new URL(WAY_POINTS_URL);

  ways.forEach((way: Way) => {
    url.searchParams.append(WAY_POINTS_SEARCH_PREFIX, `${way.position.latitude},${way.position.longitude}`);
  });

  const result = await axios.get(url.toString(), { headers: { apiKey: API_KEY } });

  return {
    coordinates: JSON.parse(result.data.polyline).coordinates,
    travelTime: result.data.travelTime,
  };
}
