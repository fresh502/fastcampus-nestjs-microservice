import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'user-service',
        port: 3001,
      },
    },
  );
  await app.listen();
  console.info(`user-service listening on 3001 for TCP`);
}

bootstrap();
