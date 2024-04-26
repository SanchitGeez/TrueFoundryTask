import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface UserStatsData {
  totalRequests: number;
  averageTokens: number;
  averageRequestsPerDay: number;
  totalSuccessRequests: number;
  dailyRequests: { date: string; dailyRequests: number }[];
  dailyTokens: { date: string; dailyTokens: number }[];
}

const UserStats: React.FC = () => {
  const [userId, setUserId] = useState<number | ''>('');
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value ? parseInt(e.target.value) : '');
  };

  const fetchData = async () => {
    try {
      const response = await axios.post<UserStatsData>('http://localhost:3000/openai/getUserStats', { userId });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">User ID:</label>
        <input type="text" id="userId" value={userId} onChange={handleUserIdChange} />
        <button type="submit">Fetch Data</button>
      </form>

      {userStats && (
        <div>
          <h2>User Stats</h2>
          <table>
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
          <h2>Daily Requests</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={userStats.dailyRequests}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dailyRequests" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <h2>Daily Tokens</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={userStats.dailyTokens}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dailyTokens" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default UserStats;
