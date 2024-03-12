import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { ModuleName } from "../../module/module.service";

export class SetupDto {
    @ApiProperty()
    @IsArray()
    modules: ModuleName[];

    @ApiProperty()
    @IsString()
    redirectUrl: string;
  }
  