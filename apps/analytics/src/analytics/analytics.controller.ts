import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @EventPattern('video_downloaded')
  async handleVideoDownloaded(@Payload() message: any) {
    console.info(`message: ${message}`);
    this.analyticsService.updateVideoDownloadCnt(message.id);
  }
}
