import { ApiProperty } from '@nestjs/swagger';

class FileDto {
  @ApiProperty()
    id: number;

  @ApiProperty()
    unique_server_filename: string;

  @ApiProperty()
    original_client_filename: string;

  @ApiProperty()
    discr: string;
}

export class FindThemeResponseDto {
  @ApiProperty()
    palette: object;

  @ApiProperty()
    logo: FileDto;

  @ApiProperty()
    favicon: FileDto;

  @ApiProperty()
    companyName: string;
}
