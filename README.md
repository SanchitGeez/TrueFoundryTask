
# Response Logging Platform

A Simple and Easy-to-Use Prompt Response Logging System 

## Link
https://true-foundry-task-ten.vercel.app/




## Key Features
* Uses OpenAI's API to make a request and streams the response
* Stores various request metrics such as response tokens model etc.
* Clean Dashboard to view all the data. And filters for better access
* Minimal UI to interact with the GPT an get response in a stream

## Using the platform
* Containes 3 pages: Chat, Dashboard and Stats
* Chat page is to interact with the GPT and make requests
* Dashboard can be used to access all requests history and filters to query the data
* Stats is where you can check the usage of a particular userId and the aggregate metrics corresponding to it.

## Run Locally
Clone the project

```bash
  git clone https://github.com/SanchitGeez/Investra.git
```
Backend

```bash
  cd backend
  npm install
  npm run start:dev
```
Frontend

```bash
  cd client
  npm install
  npm run dev
```


