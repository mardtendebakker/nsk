import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import {
  concat,
  times,
  lookup,
  increment,
} from './common/handlebars/handlebars.helpers';
import { AppModule } from './app/app.module';
import { NskNotFoundExceptionFilter } from './common/filters/nsk-not-found-exception.filter';
import { MessagingService } from './messaging/messaging.service';

async function bootstrap() {
  await MessagingService.connect();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const handlebars = hbs.create();
  app.useStaticAssets(join(process.cwd(), 'apps/server/src/assets/public'));
  app.setBaseViewsDir(join(process.cwd(), 'apps/server/src/assets/views'));
  handlebars.registerHelper('lookup', lookup);
  handlebars.registerHelper('concat', concat);
  handlebars.registerHelper('times', times);
  handlebars.registerHelper('increment', increment);
  app.engine('hbs', handlebars.__express);
  app.setViewEngine('hbs');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      '/nsk/public/pickup',
      '/nsk/public/pickuptest',
      '/nsk/public/order',
      '/nsk/public/ordertest',
      '/nsk/public/import',
      '/nsk/public/importleergelddenhaag',
    ],
  });
  app.useGlobalFilters(new NskNotFoundExceptionFilter());
  const port = process.env.PORT || 3333;
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth({
      description: 'Please enter your JWT id token',
      bearerFormat: 'JWT',
      scheme: 'bearer',
      type: 'http',
    })
    .setTitle('Revamp')
    .setDescription('The revamp Open API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('openApi', app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
