import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    ClientsModule.register([
      {
        name: 'VIDEO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'video',
            brokers: ['host.docker.internal:9092'],
          },
          consumer: {
            groupId: 'video-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
