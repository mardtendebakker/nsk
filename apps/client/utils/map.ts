import axios, { AxiosResponse } from 'axios';
import { LogisticServiceListItem } from './axios/models/logistic';

const API_KEY = process.env.MYPTV_API_KEY;
const SEARCH_TEXT_URL = process.env.MYPTV_SEARCH_TEXT_URL;
const WAY_POINTS_URL = process.env.MYPTV_WAY_POINTS_URL;

export interface Way {
  logisticService?: LogisticServiceListItem,
  address?: string,
  position?: { latitude: number, longitude: number }
}

export async function fetchWayForLogisticService(logisticServiceItem: LogisticServiceListItem): Promise<Way> {
  const { supplier } = logisticServiceItem.order;

  const address = `${supplier.street}, ${supplier.zip}, ${supplier.city}, ${supplier.state}, ${supplier.country}`;
  const result = await axios.get(`${SEARCH_TEXT_URL}${address}`, { headers: { apiKey: API_KEY } });

  return {
    logisticService: logisticServiceItem,
    position: result.data.locations[0].referencePosition,
    address: result.data.locations[0].formattedAddress,
  };
}

export async function fetchWayForLogisticServices(logisticServices: LogisticServiceListItem[]): Promise<Way[]> {
  const result = await Promise.allSettled(
    logisticServices.map((element: LogisticServiceListItem) => element && fetchWayForLogisticService(element)),
  );

  const fulfilled = result.filter(({ status }) => status == 'fulfilled') as PromiseFulfilledResult<AxiosResponse>[];

  return fulfilled.map(({ value }) => value) as Way[];
}

export async function fetchPolylineInfo(ways: Way[]): Promise<{ coordinates: [], travelTime: number }> {
  const url = new URL(WAY_POINTS_URL);

  ways.forEach((way: Way) => {
    url.searchParams.append('waypoints', `${way.position.latitude},${way.position.longitude}`);
  });

  const result = await axios.get(url.toString(), { headers: { apiKey: API_KEY } });

  return {
    coordinates: JSON.parse(result.data.polyline).coordinates,
    travelTime: result.data.travelTime,
  };
}
