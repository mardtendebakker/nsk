import { ApiProperty } from "@nestjs/swagger";
import { AServiceStatus } from "../../aservice/enum/aservice-status.enum";

export class ProcessedTask {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    description: string;
  
    @ApiProperty()
    status: AServiceStatus;
  }
