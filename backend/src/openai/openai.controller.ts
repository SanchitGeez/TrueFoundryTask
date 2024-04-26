import { Controller, Post,Get, Body, ValidationPipe,Query } from '@nestjs/common';
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

  @Get('getData')
  async getData(@Query() queryParams?: any): Promise<any> {
    try {
      let query = 'SELECT * FROM TFtask.prompt_history';
      // Check if query parameters are provided
      if (queryParams) {
        const conditions = Object.keys(queryParams)
          .map(key => `${key}='${queryParams[key]}'`)
          .join(' AND ');
        query += ` WHERE ${conditions}`;
      }

      const data = await this.openaiService.executeQuery(query);
      return data;
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  @Post('getUserStats')
  async getUserStats(@Body() data): Promise<any> {
    try {
      // Query to find the total number of requests by userId
      const totalRequestsQuery = `SELECT COUNT(*) AS totalRequests FROM TFtask.prompt_history WHERE userId = ${data.userId}`;
      const totalRequestsResult = await this.openaiService.executeQuery(totalRequestsQuery);
      const totalRequests = totalRequestsResult[0].totalRequests;

      // Query to calculate the average tokens per request for userId
      const averageTokensQuery = `SELECT AVG(promptTokens + completionTokens) AS averageTokens FROM TFtask.prompt_history WHERE userId = ${data.userId}`;
      const averageTokensResult = await this.openaiService.executeQuery(averageTokensQuery);
      const averageTokens = averageTokensResult[0].averageTokens;

      // Query to calculate the total number of days covered by the data
      const totalDaysQuery = `
        SELECT (toUnixTimestamp(MAX(createdAt)) - toUnixTimestamp(MIN(createdAt))) / 86400 + 1 AS totalDays
        FROM TFtask.prompt_history
        WHERE userId = ${data.userId}
      `;
      const totalDaysResult = await this.openaiService.executeQuery(totalDaysQuery);
      const totalDays = totalDaysResult[0].totalDays;

      // Query to find the total number of requests where the status is 'SUCCESS'
      const totalSuccessRequestsQuery = `SELECT COUNT(*) AS totalSuccessRequests FROM TFtask.prompt_history WHERE userId = ${data.userId} AND status = 'SUCCESS'`;
      const totalSuccessRequestsResult = await this.openaiService.executeQuery(totalSuccessRequestsQuery);
      const totalSuccessRequests = totalSuccessRequestsResult[0].totalSuccessRequests;

      // Query to calculate daily number of requests by date
      const dailyRequestsQuery = `
        SELECT toDate(createdAt) AS date, COUNT(*) AS dailyRequests
        FROM TFtask.prompt_history
        WHERE userId = ${data.userId}
        GROUP BY date
      `;
      const dailyRequestsResult = await this.openaiService.executeQuery(dailyRequestsQuery);

      // Query to calculate daily use of tokens by date
      const dailyTokensQuery = `
        SELECT toDate(createdAt) AS date, SUM(promptTokens + completionTokens) AS dailyTokens
        FROM TFtask.prompt_history
        WHERE userId = ${data.userId}
        GROUP BY date
      `;
      const dailyTokensResult = await this.openaiService.executeQuery(dailyTokensQuery);

      // Map daily requests and daily tokens results to arrays
      const dailyRequests = dailyRequestsResult.map(row => ({ date: row.date, dailyRequests: row.dailyRequests }));
      const dailyTokens = dailyTokensResult.map(row => ({ date: row.date, dailyTokens: row.dailyTokens }));

      // Calculate average requests per day
      const averageRequestsPerDay = totalRequests / totalDays;

      return { 
        totalRequests, 
        averageTokens, 
        averageRequestsPerDay, 
        totalSuccessRequests, 
        dailyRequests, 
        dailyTokens 
      };
    } catch (error) {
      // Handle error
      console.error('Error fetching user stats:', error);
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