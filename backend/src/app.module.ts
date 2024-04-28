import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [OpenaiModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
