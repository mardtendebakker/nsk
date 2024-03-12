import { ApiProperty } from "@nestjs/swagger";
import { ModuleName } from "../../module/module.service";
import { Status } from "../module_payment.service";

export class FindModulePaymentResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    moduleName: ModuleName;
    
    @ApiProperty()
    method: string;
    
    @ApiProperty()
    transactionId: string;
    
    @ApiProperty()
    price: number;
    
    @ApiProperty()
    status: Status;
    
    @ApiProperty()
    activeAt: Date;
    
    @ApiProperty()
    expiresAt: Date;
  }
  