import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './modules/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  // Enable CORS for local web dev
  app.enableCors({ origin: ['http://localhost:5173'], methods: ['GET','POST','OPTIONS'] });

  const port = Number(process.env.PORT || 3000);
  await app.listen({ port, host: '0.0.0.0' });
  const address = await app.getUrl();
  // eslint-disable-next-line no-console
  console.log(`Server running at ${address}`);
}

bootstrap();

