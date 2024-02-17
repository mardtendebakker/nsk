interface Location {
  latitude: number;
  longitude: number;
}

export interface Vehicle {
  id: number;
  number: number;
  location: Location;
  licensePlate: string;
  make: string;
  model: string;
  driverName?: string;
  description?: string;
  running: boolean;
}
