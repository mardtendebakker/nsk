import { ApiProperty } from "@nestjs/swagger";
import { ServiceStatus } from "../../service/enum/service-status.enum";

export class ProcessedTask {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    description: string;
  
    @ApiProperty()
    status: ServiceStatus;
  }
