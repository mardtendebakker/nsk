import { Injectable } from '@nestjs/common';
import { VehicleResponseDto } from './dto/vehicle-response.dto';
import { FleetGoService } from '../fleet-go/fleet-go.service';

@Injectable()
export class VehicleService {
  constructor(private readonly fleetGoService: FleetGoService) { }

  async findAll(): Promise<VehicleResponseDto[]> {
    const equipments = await this.fleetGoService.getEquipments();

    return equipments.map(equipment => {
      return {
        id: equipment.Id,
        number: equipment.EquipmentHeader.VehicleNumber,
        location: {
          latitude: equipment.Location.Latitude,
          longitude: equipment.Location.Longitude,
        },
        licensePlate: equipment.EquipmentHeader.SerialNumber,
        make: equipment.EquipmentHeader.Make,
        model: equipment.EquipmentHeader.Model,
        driverName: equipment.DriverName,
        description: equipment.Description,
      }
    });
  }
}
