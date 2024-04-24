import { Injectable,Inject } from '@nestjs/common';
import OpenAI from "openai";
import { ChatCompletionCreateParams } from 'openai/resources';
import { ClickHouse } from 'clickhouse';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

interface PromptMessage {
    role: string;
    content: string;
}

interface PromptHistory {
  userId: number;
  requestId?: number;
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
          url: 'http://localhost', 
          port: 8123, 
          debug: false,
        });
      }
    
    async singlePrompt(data: PromptMessage[]) {
        const completion = await openai.chat.completions.create({
            messages: data as ChatCompletionCreateParams['messages'],
            model: "gpt-3.5-turbo",
        });

        return completion;
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
        const query = `
          INSERT INTO TFtask.prompt_history
          (userId, requestId, createdAt, status, request, response, model, promptTokens, completionTokens)
          VALUES
          (${data.userId}, ${data.requestId || 1}, '${data.createdAt || 'now()'}', '${data.status}', '${data.request}', '${data.response}', '${data.model}', ${data.promptTokens}, ${data.completionTokens})
        `;
  
        await this.clickHouse.query(query).toPromise();
      } catch (error) {
        // Handle error
        console.error('Error inserting data:', error);
        throw error;
      }
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
