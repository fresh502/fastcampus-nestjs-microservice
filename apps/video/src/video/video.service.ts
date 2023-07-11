import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Video } from './entity/video.entity';
import { join } from 'path';
import { readFile, stat, writeFile } from 'fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VideoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @Inject('VIDEO_SERVICE') private client: ClientProxy,
  ) {}

  async upload(
    userId: string,
    title: string,
    mimetype: string,
    extension: string,
    buffer: Buffer,
  ): Promise<Video> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    let error;
    try {
      const video = await queryRunner.manager.save(
        queryRunner.manager.create(Video, { title, mimetype, userId }),
      );
      await this.uploadVideo(video.id, extension, buffer);
      await queryRunner.commitTransaction();
      return video;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async download(
    id: string,
  ): Promise<{ buffer: Buffer; mimetype: string; size: number }> {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) throw new NotFoundException('No video');

    const { mimetype } = video;
    const extension = mimetype.split('/')[1];
    const videoPath = join(
      process.cwd(),
      'video-storage',
      `${id}.${extension}`,
    );
    const { size } = await stat(videoPath);
    const buffer = await readFile(videoPath);

    this.client.emit('video_downloaded', { id: video.id });

    return { buffer, mimetype, size };
  }

  private async uploadVideo(id: string, extension: string, buffer: Buffer) {
    const filePath = join(process.cwd(), 'video-storage', `${id}.${extension}`);
    await writeFile(filePath, Buffer.from(buffer));
  }
}
