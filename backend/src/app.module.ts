import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';

@Module({
  imports: [ClickHouseModule.register([
    {
      name: 'ANALYTICS_SERVER',
      host: '127.0.0.1',
      port: 8123,
      database: 'TFtask'
    },
  ]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
