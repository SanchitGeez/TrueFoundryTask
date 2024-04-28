import React, { useEffect, useState } from 'react';
import { fetchEventData } from 'fetch-sse';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  
const ChatBox: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [uId, setUId] = useState<string>('');
  const [gptResponse, setGptResponse] = useState<string>('');;
  const [logPromptEntry, setLogPromptEntry] = useState<PromptHistory>()
  const [lastChunk, setLastChunk] = useState();
  const [streamEnded, setStreamEnded] = useState(false);

  const callInsert = async()=>{
    console.log("response before calling",gptResponse)
    await axios.post("http://localhost:3000/openai/insertPromptHistory",logPromptEntry);
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGptResponse('');
    setStreamEnded(false);
    if (prompt.trim() !== '') {
        
        const header = {
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImhPT3o1eDZIT1VHWGthbnZ5SjFTbnRiMktLbyJ9.eyJhdWQiOiJmODBiOTFlMC0yYWM4LTRiMDMtOGUwYi1lODhlNzg0NGZkMTEiLCJleHAiOjM3MTQxOTkzOTYsImlhdCI6MTcxNDE5OTM5NiwiaXNzIjoidHJ1ZWZvdW5kcnkuY29tIiwic3ViIjoiY2x2aHEyN2R1MTh6NTAxdTg3YjBvZmdtYiIsImp0aSI6Ijk0NDQzOTQ1LTQyNTUtNDUxZi04Mjk2LWUwOTQ4NTU3NTVjNiIsInVzZXJuYW1lIjoidGFzayIsInVzZXJUeXBlIjoic2VydmljZWFjY291bnQiLCJ0ZW5hbnROYW1lIjoidHJ1ZWZvdW5kcnkiLCJyb2xlcyI6WyJ0ZW5hbnQtbWVtYmVyIl0sImFwcGxpY2F0aW9uSWQiOiJmODBiOTFlMC0yYWM4LTRiMDMtOGUwYi1lODhlNzg0NGZkMTEifQ.PQoZAdTvnLC8zJILAUlLJm-0emfvfxSvmhuyBd3nOywrs-Lkrbjb6JzaqprJhZaTrH_6JuH9rNuUlLKGtuiZQghjkfn8_YuQr3h4DtoWzvf5y3Yi7ZAYxlfhQutA0QD41fNRcO-1-xZ0n7lCkgF0zlHysGvN1qw4yQNBpk_i2OV48AejwmG9YrlSvYnmsQRO7lv5c44Q_LckIRlCwocw5nPWMhqrCnT2m7-HgyNq653gAclaBsOwF_FjcFy19Cp4FCIbj_mBvUQNMPRjJcM_3mUvTwHaqki21OdCTaSluMHT3TybJCVGby988tnjwbYC1fRx7Iky1iy8KMlQL-KGVg",
        "X-TFY-METADATA": "{'tfy_log_request': 'true', 'Custom-Metadata': 'Custom-Value'}",
        responseType: 'stream',
        }
        await fetchEventData(
        "https://llm-gateway.truefoundry.com/api/inference/openai/chat/completions",
        {
            method: 'POST',
            data:{ 
            "messages": [
              {"role": "user", "content": prompt},
            ],
            "model": "open-ai-account/gpt-3-5-turbo",
            "max_tokens": 256,
            "stream": true,
            },
            headers:header,
            onMessage:async(event)=>{
                const eventData = JSON.parse(event?.data ?? '');
                if (eventData !== '[DONE]') {

                    const chunkContent = eventData.choices[0]?.delta?.content;
                    if(chunkContent){
                        setLastChunk(eventData)
                        setGptResponse(prevResponse => prevResponse + chunkContent);
                    }
                    if(chunkContent==undefined){
                        setStreamEnded(true);
                    }

                }
            }
        })

    }
  };

  useEffect(() => {
    console.log("logggggg:",logPromptEntry);
    if(gptResponse!==''){
        callInsert();
    }
  }, [logPromptEntry])

  useEffect(()=>{
    if(streamEnded){
      console.log("prompttt",prompt)
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
      console.log("gpt res",gptResponse);
      if (lastChunk) { // Check if lastChunk is not undefined
        const updatedLogPromptEntry = {
            userId: uId ?? 'na',
            requestId: (lastChunk as { id: string }).id,
            createdAt: formattedCurrentDate,
            status: "SUCCESS",
            request: prompt,
            response: gptResponse,
            model: "gpt-3.5-turbo-0125",
            promptTokens: prompt.length / 4,
            completionTokens: gptResponse.length / 4
        };
        setLogPromptEntry(updatedLogPromptEntry);
      }else{
        console.log("NOCHUNK")
      }
    }
    
  },[streamEnded])
  
  return (
    <div className="chatBox">
      <Link to="/">
        <h4>HOMEPAGE</h4>
      </Link>
      <div className="conversation">
        {gptResponse}
      </div>
      <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder="Enter UserId"
        value={uId !== undefined ? uId : ''}
        onChange={(e) => setUId(e.target.value)}
      />

        <input
          type="text"
          placeholder="Type your message here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
