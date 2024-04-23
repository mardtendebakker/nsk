import {
  Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalService } from './local.service';
import { LocalGuard } from './local.guard';
import { LocalLoginDto } from './dto/local-login.dto';

@ApiTags('auth-local')
@Controller('auth/local')
export class LocalController {
  constructor(private localService: LocalService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LocalLoginDto) {
    return this.localService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(LocalGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
