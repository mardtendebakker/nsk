import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class PrismaCreateFileDto implements Prisma.afileCreateInput {
  @ApiProperty()
  original_client_filename: string;

  @ApiProperty()
  unique_server_filename: string;

  @ApiProperty()
  discr: string;

  @ApiPropertyOptional()
  external_id?: number;

  @ApiPropertyOptional()
  product?: Prisma.productCreateNestedOneWithoutAfileInput;

  @ApiPropertyOptional()
  aorder?: Prisma.aorderCreateNestedOneWithoutAfileInput;

  @ApiPropertyOptional()
  pickup?: Prisma.pickupCreateNestedOneWithoutAfileInput;
}
