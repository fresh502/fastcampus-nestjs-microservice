import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './entity/analytics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
