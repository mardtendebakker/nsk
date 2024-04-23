import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalService } from './local.service';
import { LocalController } from './local.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('LOCAL_SECRET'),
        signOptions: {expiresIn: configService.get<string>('LOCAL_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LocalService],
  controllers: [LocalController],
  exports: [LocalService],
})
export class LocalModule {}
