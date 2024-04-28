import { Route, Routes } from 'react-router-dom'
import './App.css'
import PromptTable from './components/PromptTable'
import UserStats from './components/UserStats'
import ChatBox from './components/ChatBox'
import Home from './components/Home'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/chat' element={<ChatBox/>}/>
      <Route path='/dashboard' element={<PromptTable/>}/>
      <Route path='/stats' element={<UserStats/>}/>
    </Routes>
  )
} 
export default App
