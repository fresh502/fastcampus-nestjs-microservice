import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { VideoController } from './video.controller';

@Module({
  providers: [
    VideoService,
    {
      provide: 'VIDEO_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'video-service',
            port: 3002,
          },
        });
      },
    },
  ],
  controllers: [VideoController],
})
export class VideoModule {}
