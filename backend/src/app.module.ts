import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [ClickHouseModule.register([
    {
      name: 'ANALYTICS_SERVER',
      host: '127.0.0.1',
      port: 8123,
      database: 'TFtask'
    },
  ]), OpenaiModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
