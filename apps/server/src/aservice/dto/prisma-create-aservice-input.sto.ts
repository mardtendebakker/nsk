import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

export class PrismaUncheckedCreateAServiceInputDto implements Prisma.aserviceUncheckedCreateInput {
    @ApiPropertyOptional()
    id?: number;

    @ApiProperty()
    status: number;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    discr: string;

    @ApiPropertyOptional()
    price?: number;

    @ApiPropertyOptional()
    relation_id?: number;
    
    @ApiPropertyOptional()
    task_id?: number;
}
