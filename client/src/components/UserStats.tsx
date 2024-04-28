import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

interface UserStatsData {
  totalRequests: number;
  averageTokens: number;
  averageRequestsPerDay: number;
  totalSuccessRequests: number;
  dailyRequests: { date: string; dailyRequests: number }[];
  dailyTokens: { date: string; dailyTokens: number }[];
}

const UserStats: React.FC = () => {
  const [userId, setUserId] = useState<string | ''>('');
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);

  const fetchData = async () => {
    try {

      const response = await axios.post<UserStatsData>('http://localhost:3000/openai/getUserStats', { userId:userId });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };
  return (
    <div>
      <Link to="/">
        <h4>HOMEPAGE</h4>
      </Link>
      <h2>User Stats</h2>
      <form className="userStatsForm" onSubmit={handleSubmit}>
        <label htmlFor="userId">User ID:</label>
        <input type="text" id="userId" value={userId} onChange={(e)=>setUserId(e.target.value)} />
        <button type="submit">Fetch Data</button>
      </form>
      
      {userStats && (
        <div className="userStatsContainer">
          
          <table className="userStatsTable">
            <thead>
              <tr>
                <th>Total Requests</th>
                <th>Average Tokens</th>
                <th>Average Requests Per Day</th>
                <th>Total Success Requests</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userStats.totalRequests}</td>
                <td>{userStats.averageTokens}</td>
                <td>{userStats.averageRequestsPerDay}</td>
                <td>{userStats.totalSuccessRequests}</td>
              </tr>
            </tbody>
          </table>
          <div className="chartsContainer">
            <div className="chartWrapper">
              <h2>Daily Requests</h2>
              <div className="chart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userStats.dailyRequests}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="dailyRequests" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chartWrapper">
              <h2>Daily Tokens</h2>
              <div className="chart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userStats.dailyTokens}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="dailyTokens" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};
  
  

export default UserStats;
