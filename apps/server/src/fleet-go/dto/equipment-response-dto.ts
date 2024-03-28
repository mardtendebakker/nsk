class EquipmentHeader {
  Make: string;

  Model: string;

  SerialNumber: string;

  EquipmentID: string;

  VehicleNumber: number;
}

class Location {
  Latitude: number;

  Longitude: number;
}

export class EquipmentResponseDto {
  Id: number;

  EquipmentHeader: EquipmentHeader;

  Location: Location;

  DriverName?: string;

  Description?: string;

  EngineRunning: boolean;
}
