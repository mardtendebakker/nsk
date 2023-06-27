import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { task } from "@prisma/client";

export class TaskEntity implements task {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string | null;
}
