import { Injectable,Inject } from '@nestjs/common';
import { ClickHouseClient } from '@depyronick/nestjs-clickhouse';

interface firstTable {
  userId: number;
  message: string;
  timestamp: number;
  // ...
}

@Injectable()
export class AppService {

  constructor(
    @Inject('ANALYTICS_SERVER')
    private readonly analyticsServer: ClickHouseClient,
  ) {}

  insertNew(): void{
    this.analyticsServer
      .insert<firstTable>('first_table', [
        {
          timestamp: new Date().getTime(),
          message: 'XXXOSX',
          userId: 102
        },
      ])
      .subscribe({
        error: (err: any): void => {
          console.log('error');
        },
        next: (): void => {
          // currently next does not emits anything for inserts
        },
        complete: (): void => {
          console.log('compleeete')
        },
      });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
