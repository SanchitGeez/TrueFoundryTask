import { Controller, Post,Get, Body, ValidationPipe } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}

    @Get('singlePrompt')
    singlePrompt(@Body(ValidationPipe) messages){
        return this.openaiService.singlePrompt(messages);
    }   
    @Post('insertPromptHistory')
  async addData(@Body() data): Promise<void> {
    try {
      await this.openaiService.insertData(data);
    } catch (error) {
      // Handle error
      console.error('Error adding data:', error);
      throw error;
    }
  }

    @Get('exQ')
  async getData(): Promise<any> {
    try {
      // Example SELECT query
      const query = 'SELECT * FROM TFtask.prompt_history';
      const data = await this.openaiService.executeQuery(query);
      return data;
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}


// CREATE TABLE IF NOT EXISTS TFtask.prompt_history
// (
//     userId UInt64 DEFAULT 1,
//     requestId UInt64 DEFAULT 1,
//     createdAt DateTime DEFAULT now(),
//     status String,
//     request String,
//     response String,
//     model String,
//     promptTokens UInt64,
//     completionTokens UInt64
// )
// ENGINE = MergeTree()
// PRIMARY KEY (requestId)


//INSERT INTO TFtask.prompt_history VALUES (DEFAULT,DEFAULT,DEFAULT,'SUCCESS','How many moons does jupiter has?','Jupiter has 95 Moons','gpt-3.5-turbo',13,9);

//select * from TFtask.prompt_history