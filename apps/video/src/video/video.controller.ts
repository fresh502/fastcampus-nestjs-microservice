import { Controller, Get } from '@nestjs/common';
import { VideoService } from './video.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @MessagePattern({ cmd: 'upload' })
  async upload({
    userId,
    title,
    mimetype,
    extension,
    buffer,
  }: {
    userId: string;
    title: string;
    mimetype: string;
    extension: string;
    buffer: { type: 'buffer'; data: number[] };
  }): Promise<{ id: string }> {
    const video = await this.videoService.upload(
      userId,
      title,
      mimetype,
      extension,
      Buffer.from(buffer.data),
    );
    return { id: video.id };
  }

  @MessagePattern({ cmd: 'download' })
  async download({ id }: { id: string }) {
    return this.videoService.download(id);
  }
}
