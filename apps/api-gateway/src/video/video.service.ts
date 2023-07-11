import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReadStream } from 'fs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VideoService {
  constructor(@Inject('VIDEO_SERVICE') private client: ClientProxy) {}

  async upload(
    userId: string,
    title: string,
    mimetype: string,
    extension: string,
    buffer: Buffer,
  ): Promise<{ id: string }> {
    const pattern = { cmd: 'upload' };
    const payload = { userId, title, mimetype, extension, buffer };
    const { id } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return { id };
  }

  async download(id: string) {
    const pattern = { cmd: 'download' };
    const payload = { id };
    const { buffer, mimetype, size } = await firstValueFrom<{
      buffer: { type: 'buffer'; data: number[] };
      mimetype: string;
      size: number;
    }>(
      this.client.send<{
        buffer: { type: 'buffer'; data: number[] };
        mimetype: string;
        size: number;
      }>(pattern, payload),
    );
    return {
      stream: ReadStream.from(Buffer.from(buffer.data)),
      mimetype,
      size,
    };
  }
}
