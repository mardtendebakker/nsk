import { Module, Provider } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

const rabbitMQProvider: Provider = {
  provide: 'APP_INITIALIZER',
  useFactory: (rabbitMQService: RabbitMQService) => async () => {
    await rabbitMQService.onModuleInit();
  },
  inject: [RabbitMQService],
};

@Module({
  providers: [
    RabbitMQService,
    rabbitMQProvider,
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
