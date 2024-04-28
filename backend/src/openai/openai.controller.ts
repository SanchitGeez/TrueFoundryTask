import { Controller, Post,Get, Body, ValidationPipe,Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}

    @Post('insertPromptHistory')
    async addData(@Body() data): Promise<void> {
    try {
      await this.openaiService.insertData(data);
    } catch (error) {
      console.error('Error adding data:', error);
      throw error;
    }
  }

  @Get('getData')
  async getData(@Query() queryParams?: any): Promise<any> {
    try {
      let query = 'SELECT * FROM prompt_history';

      if (queryParams) {
        const conditions = Object.keys(queryParams)
          .map(key => `${key}='${queryParams[key]}'`)
          .join(' AND ');
        query += ` WHERE ${conditions}`;
      }

      const data = await this.openaiService.executeQuery(query);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  @Post('getUserStats')
  async getUserStats(@Body() data): Promise<any> {
    try {
      return this.openaiService.getUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
}