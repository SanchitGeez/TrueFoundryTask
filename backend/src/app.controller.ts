import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('insert-data')
  async insertData(): Promise<string> {
    try {
      await this.appService.insertNew();
      return 'Data inserted successfully';
    } catch (error) {
      return 'Failed to insert data';
    }
  }
}
