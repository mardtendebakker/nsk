import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [
    RabbitMQService,
  ],
  exports: [RabbitMQService],
})
@Global()
export class RabbitMQModule {}
