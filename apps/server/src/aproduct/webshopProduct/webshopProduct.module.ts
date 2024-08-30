import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FileModule } from '../../file/file.module';
import { LocationModule } from '../../admin/location/location.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { EntityStatus } from '../../common/types/entity-status.enum';
import { LocationLabelModule } from '../../location-label/location-label.module';
import { BlanccoModule } from '../../blancco/blancco.module';
import { WebshopProductBlancco } from './webshopProduct.blancco';
import { PrintModule } from '../../print/print.module';
import { WebshopService } from '../../webshop/webshop.service';
import { WebshopProductService } from './webshopProduct.service';
import { WebshopProductRepository } from './webshopProduct.repository';
import { WebshopProductController } from './webshopProduct.controller';
import { RabbitMQModule } from '../../rabbitmq/rabbitmq.module';

@Global()
@Module({
  providers: [
    WebshopProductService,
    WebshopProductRepository,
    WebshopService,
    {
      provide: 'ENTITY_STATUS',
      useValue: EntityStatus.Webshop,
    },
    WebshopProductBlancco,
  ],
  controllers: [WebshopProductController],
  imports: [
    PrismaModule,
    LocationModule,
    LocationLabelModule,
    FileModule,
    BlanccoModule,
    PrintModule,
    HttpModule,
    RabbitMQModule,
  ],
  exports: [WebshopProductService],
})
export class WebshopProductModule {}
