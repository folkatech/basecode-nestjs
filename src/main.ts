import { NestFactory } from '@nestjs/core';
import * as winston from 'winston';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { install } from 'source-map-support';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule, utilities as nestWinstonModuleUtil } from 'nest-winston';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/all-exception-filter';

require('newrelic');

function createNewrelicWinstonFormatter() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const newrelicFormatter = require('@newrelic/winston-enricher'); // somehow gabisa pakai `import * as...`
  return newrelicFormatter(winston);
}

async function bootstrap() {
  install();
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            createNewrelicWinstonFormatter()(),
            nestWinstonModuleUtil.format.nestLike(process.env.APP_NAME, { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableVersioning({ type: VersioningType.URI });

  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('app.port');

  await app.listen(appPort);
}
bootstrap();
