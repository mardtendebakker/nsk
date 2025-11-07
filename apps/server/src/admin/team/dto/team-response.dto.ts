import { ApiProperty } from '@nestjs/swagger';

export class TeamResponseDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    name: string;

  @ApiProperty()
    createdAt: Date;

  @ApiProperty()
    updatedAt: Date;
}
