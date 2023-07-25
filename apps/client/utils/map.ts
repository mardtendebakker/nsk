import axios, { AxiosResponse } from 'axios';
import { PickupListItem } from './axios/models/pickup';

const API_KEY = process.env.MYPTV_API_KEY;
const SEARCH_TEXT_URL = process.env.MYPTV_SEARCH_TEXT_URL;
const WAY_POINTS_URL = process.env.MYPTV_WAY_POINTS_URL;

export interface Way {
  pickup?: PickupListItem,
  address?: string,
  position?: { latitude: number, longitude: number }
}

export async function fetchWayForPickup(pickupItem: PickupListItem): Promise<Way> {
  const { supplier } = pickupItem.order;

  const address = `${supplier.street}, ${supplier.zip}, ${supplier.city}, ${supplier.state}, ${supplier.country}`;
  const result = await axios.get(`${SEARCH_TEXT_URL}${address}`, { headers: { apiKey: API_KEY } });

  return {
    pickup: pickupItem,
    position: result.data.locations[0].referencePosition,
    address: result.data.locations[0].formattedAddress,
  };
}

export async function fetchWayForPickups(pickups: PickupListItem[]): Promise<Way[]> {
  const result = await Promise.allSettled(
    pickups.map((element: PickupListItem) => element && fetchWayForPickup(element)),
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
