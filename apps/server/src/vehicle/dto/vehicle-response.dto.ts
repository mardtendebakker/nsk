class Location {
  latitude: number;

  longitude: number;
}

export class VehicleResponseDto {
  id: number;

  number: number;

  location: Location;

  licensePlate: string;

  make: string;

  model: string;

  driverName?: string;

  description?: string;
}
