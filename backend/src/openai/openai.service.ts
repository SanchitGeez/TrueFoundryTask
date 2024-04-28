import { Injectable,Inject } from '@nestjs/common';
import OpenAI from "openai";
import { ChatCompletionCreateParams } from 'openai/resources';
import { ClickHouse } from 'clickhouse';
import { createClient } from '@clickhouse/client'
import 'dotenv/config';

interface PromptHistory {
  userId: string;
  requestId?: string;
  createdAt?: string;
  status: string;
  request: string;
  response: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  }

@Injectable()
export class OpenaiService {

    private readonly clickHouse: ClickHouse;

      constructor() {
        this.clickHouse = new ClickHouse({
          host: 'https://pn5kdvkmja.ap-south-1.aws.clickhouse.cloud:8443',
          username: 'default',
          password: process.env.DB_PASS || 'cKoI2R9Fun~R3',
        });
      }
    async executeQuery(query: string): Promise<any> {
      try {
        const result = await this.clickHouse.query(query).toPromise();
        return result;
      } catch (error) {
        // Handle error
        console.error('Error executing query:', error);
        throw error;
      }
    }

    async insertData(data: PromptHistory): Promise<void> {
      try {
        // Construct INSERT query
        const createdAtValue = data.createdAt ? `'${data.createdAt}'` : 'NOW()';
    
        const modifiedResponse  = data.response.replace(/'/g, "\\'")
        console.log("modified responseeeeeeeeeeeeeeeeeeeeeee",modifiedResponse)
        const query = `
          INSERT INTO prompt_history
          (userId, requestId, createdAt, status, request, response, model, promptTokens, completionTokens)
          VALUES
          ('${data.userId}', '${data.requestId || 1}', ${createdAtValue}, '${data.status}', '${data.request}', '${modifiedResponse}', '${data.model}', ${data.promptTokens}, ${data.completionTokens})
        `;
        console.log("querryyyy",query);
        await this.clickHouse.query(query).toPromise();
      } catch (error) {
        // Handle error
        console.error('Error inserting data:', error);
        throw error;
      }
    }
    

    async getUserStats(data) {
      const u = "'"+data.userId+"'";
      // Query to find the total number of requests by userId
      const totalRequestsQuery = `SELECT COUNT(*) AS totalRequests FROM prompt_history WHERE userId = ${u}`;
      const totalRequestsResult = await this.executeQuery(totalRequestsQuery);
      const totalRequests = totalRequestsResult[0].totalRequests;
  
      // Query to calculate the average tokens per request for userId
      const averageTokensQuery = `SELECT AVG(promptTokens + completionTokens) AS averageTokens FROM prompt_history WHERE userId = ${u}`;
      const averageTokensResult = await this.executeQuery(averageTokensQuery);
      const averageTokens = averageTokensResult[0].averageTokens;
  
      // Query to calculate the total number of days covered by the data
      const totalDaysQuery = `
        SELECT (toUnixTimestamp(MAX(createdAt)) - toUnixTimestamp(MIN(createdAt))) / 86400 + 1 AS totalDays
        FROM prompt_history
        WHERE userId = ${u}
      `;
      const totalDaysResult = await this.executeQuery(totalDaysQuery);
      const totalDays = totalDaysResult[0].totalDays;
  
      // Query to find the total number of requests where the status is 'SUCCESS'
      const totalSuccessRequestsQuery = `SELECT COUNT(*) AS totalSuccessRequests FROM prompt_history WHERE userId = ${u} AND status = 'SUCCESS'`;
      const totalSuccessRequestsResult = await this.executeQuery(totalSuccessRequestsQuery);
      const totalSuccessRequests = totalSuccessRequestsResult[0].totalSuccessRequests;
  
      // Query to calculate daily number of requests by date
      const dailyRequestsQuery = `
        SELECT toDate(createdAt) AS date, COUNT(*) AS dailyRequests
        FROM prompt_history
        WHERE userId = ${u}
        GROUP BY date
      `;
      const dailyRequestsResult = await this.executeQuery(dailyRequestsQuery);
  
      // Query to calculate daily use of tokens by date
      const dailyTokensQuery = `
        SELECT toDate(createdAt) AS date, SUM(promptTokens + completionTokens) AS dailyTokens
        FROM prompt_history
        WHERE userId = ${u}
        GROUP BY date
      `;
      const dailyTokensResult = await this.executeQuery(dailyTokensQuery);
  
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
  }
  

    // async insertPromptHistory(){
    //     this.promptServer
    //   .insert<PromptHistory>('prompt_history', [
    //     {
    //     userId:1,
    //     requestId:1,
    //     createdAt : new Date().getTime(),
    //     status: 'SUCCESS',
    //     request: 'Who are you?',
    //     response: 'I am the chatGPT by OpenAI',
    //     model: 'gpt-3.5-turbo',
    //     promptTokens:9,
    //     completionTokens:12,
    //     },
    //   ])
    //   .subscribe({
    //     error: (err: any): void => {
    //       console.log('error');
    //     },
    //     next: (): void => {
    //       // currently next does not emits anything for inserts
    //     },
    //     complete: (): void => {
    //       console.log('compleeete')
    //     },
    //   });
    //     return "rows";
    // }

}
