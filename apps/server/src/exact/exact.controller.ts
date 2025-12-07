import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExactService } from './exact.service';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('exact')
@Controller('exact')
export class ExactController {
  constructor(private readonly exactService: ExactService) {}

  @Post('oauth2/refresh-token')
  @ApiOperation({ summary: 'Exchange refresh token for access token' })
  @ApiResponse({ type: TokenResponseDto })
  async refreshToken(
    @Body() body: RefreshTokenRequestDto
  ): Promise<TokenResponseDto> {
    return this.exactService.refreshToken(body.refreshToken);
  }
}
