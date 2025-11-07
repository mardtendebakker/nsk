import { ApiProperty } from '@nestjs/swagger';

export class TeamEntity {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    updatedAt: Date;
}
