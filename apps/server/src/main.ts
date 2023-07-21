/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { join } from 'path';
import { concat, times, lookup, increment } from './common/handlebars/handlebars.helpers';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const handlebars = hbs.create();
  app.useStaticAssets(join(process.cwd(), 'apps/server/src/assets/public'));
  app.setBaseViewsDir(join(process.cwd(), 'apps/server/src/assets/views'));
  handlebars.registerHelper('lookup', lookup);
  handlebars.registerHelper('concat', concat);
  handlebars.registerHelper('times', times);
  handlebars.registerHelper('increment', increment);
  app.engine('hbs', handlebars.__express)
  app.setViewEngine('hbs');
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth({
      description: `Please enter your JWT id token`,
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
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
