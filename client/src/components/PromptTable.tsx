import React, { useState, useEffect } from 'react';
import axios from 'axios';


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

const PromptTable = () => {
    const [data, setData] = useState<PromptHistory[]>([]);

    const [userId, setUserId] = useState('');
    const [requestId, setRequestId] = useState('');
    const [status, setStatus] = useState('');
    const [model,setModel] = useState('');
    const [request, setRequest] = useState('');
    const [response,setResponse] = useState('');

    const handleFilterApply = (e: any) => {
      e.preventDefault();
      let params: string = '';
  
      // Add conditions for userId
      if (userId !== '') {
          params += 'userId=' + userId;
      }
  
      // Add conditions for requestId
      if (requestId !== '') {
          params += (params !== '' ? '&' : '') + 'requestId=' + requestId;
      }
  
      // Add conditions for status
      if (status !== '') {
          params += (params !== '' ? '&' : '') + 'status=' + status;
      }
  
      // Add conditions for model
      if (model !== '') {
          params += (params !== '' ? '&' : '') + 'model=' + model;
      }
  
      // Add conditions for request
      if (request !== '') {
          params += (params !== '' ? '&' : '') + 'request=' + request;
      }
  
      // Add conditions for response
      if (response !== '') {
          params += (params !== '' ? '&' : '') + 'response=' + response;
      }
      if(params!==''){
        fetchData(params);
      }

      console.log(model);
  };
  

    const fetchData = async (params:string) => {
      try {
        const response = await axios.get<PromptHistory[]>('http://localhost:3000/openai/getData?'+params);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
        fetchData("requestId=1");
  }, []);
  return (
    <div>
      <h1>Your Data</h1>
      <form className="filterFields" onSubmit={handleFilterApply}>
        <div>
            <label htmlFor="userId">User ID:</label>
            <input type="text" id="userId" name="userId" value={userId} onChange={(e)=>setUserId(e.target.value)} />
        </div>
        <div>
      <label htmlFor="requestId">Request ID:</label>
      <input type="text" id="requestId" name="requestId" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
      </div>

        <div>
            <label htmlFor="status">Status:</label>
            <input type="text" id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>

        <div>
            <label htmlFor="model">Model:</label>
            <input type="text" id="model" name="model" value={model} onChange={(e) => setModel(e.target.value)} />
        </div>

        <div>
            <label htmlFor="request">Request:</label>
            <input type="text" id="request" name="request" value={request} onChange={(e) => setRequest(e.target.value)} />
        </div>

        <div>
            <label htmlFor="response">Response:</label>
            <input type="text" id="response" name="response" value={response} onChange={(e) => setResponse(e.target.value)} />
        </div>
        <button type='submit'>Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Request ID</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Request</th>
            <th>Response</th>
            <th>Model</th>
            <th>Prompt Tokens</th>
            <th>Completion Tokens</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr>
              <td>{item.userId}</td>
              <td>{item.requestId}</td>
              <td>{item.createdAt}</td>
              <td>{item.status}</td>
              <td>{item.request}</td>
              <td>{item.response}</td>
              <td>{item.model}</td>
              <td>{item.promptTokens}</td>
              <td>{item.completionTokens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PromptTable