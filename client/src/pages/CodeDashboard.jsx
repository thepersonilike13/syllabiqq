import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser, setStoredUser } from '../utils/auth';
import StatsOverview from '../components/StatsOverview';
import RatingChart from '../components/RatingChart';
import TopicAnalysis from '../components/TopicAnalysis';
import PlatformBreakdown from '../components/PlatformBreakdown';
import ActivityCalendar from '../components/ActivityCalendar';
import '../styles/codedashboard.css';

function CodeDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [links, setLinks] = useState({ leetcode: '', codeforces: '' });

  useEffect(() => {
    const stored = getStoredUser();
    setAuthUser(stored);
    if (!stored?.id) {
      setLoading(false);
      return;
    }
    loadUserLinks(stored.id);
  }, []);

  const loadUserLinks = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/links`);
      const data = response.data?.data || {};
      const normalized = {
        leetcode: data.leetcode || '',
        codeforces: data.codeforces || ''
      };
      setLinks(normalized);
      setStoredUser({
        ...getStoredUser(),
        links: data
      });
      await fetchCombinedAnalytics(normalized);
    } catch (err) {
      console.error('Error fetching user links:', err);
      setError(err.response?.data?.message || 'Failed to load user links');
    } finally {
      setLoading(false);
    }
  };

  const fetchCombinedAnalytics = async (userHandles = links) => {
    try {
      setLoading(true);
      setError(null);

      if (!userHandles.leetcode && !userHandles.codeforces) {
        setError('Please add your LeetCode or Codeforces handle in your profile.');
          setLoading(false); 
          
        return;
      }

      // Fetch combined analytics from backend
      const response = await axios.get('http://localhost:5000/api/platform/combined', {
        params: {
          leetcode: userHandles.leetcode,
          codeforces: userHandles.codeforces
        }
      });

      setUserData(response.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your competitive programming profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          {authUser?.id ? (
            <button onClick={() => fetchCombinedAnalytics()}>Retry</button>
          ) : (
            <Link className="dashboard-link" to="/login">Go to Login</Link>
          )}
        </div>
      </div>
    );
  }

  if (!authUser?.id) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>Login Required</h2>
          <p>Please login to view your dashboard.</p>
          <Link className="dashboard-link" to="/login">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>No Data</h2>
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🎯 Competitive Programming Dashboard</h1>
          <div className="user-badges">
            {userData.profiles.leetcode && (
              <span className="badge leetcode-badge">
                LeetCode: {userData.profiles.leetcode.username}
              </span>
            )}
            {userData.profiles.codeforces && (
              <span className="badge codeforces-badge">
                Codeforces: {userData.profiles.codeforces.handle}
              </span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <Link className="dashboard-link" to="/profile">Update Profile</Link>
        </div>
      </header>

      {/* Main Stats Overview */}
      <StatsOverview data={userData} />

      {/* Platform Breakdown & Difficulty */}
      <div className="grid-2-col">
        <PlatformBreakdown data={userData} />
        {userData.profiles.leetcode && (
          <div className="card difficulty-card">
            <h3>📊 Difficulty Breakdown</h3>
            <div className="difficulty-bars">
              <div className="difficulty-item easy">
                <div className="difficulty-label">
                  <span>Easy</span>
                  <span className="count">{userData.profiles.leetcode.difficultyBreakdown.easy}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill easy-fill"
                    style={{
                      width: `${(userData.profiles.leetcode.difficultyBreakdown.easy / userData.profiles.leetcode.totalSolved) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="difficulty-item medium">
                <div className="difficulty-label">
                  <span>Medium</span>
                  <span className="count">{userData.profiles.leetcode.difficultyBreakdown.medium}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill medium-fill"
                    style={{
                      width: `${(userData.profiles.leetcode.difficultyBreakdown.medium / userData.profiles.leetcode.totalSolved) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="difficulty-item hard">
                <div className="difficulty-label">
                  <span>Hard</span>
                  <span className="count">{userData.profiles.leetcode.difficultyBreakdown.hard}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill hard-fill"
                    style={{
                      width: `${(userData.profiles.leetcode.difficultyBreakdown.hard / userData.profiles.leetcode.totalSolved) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating History Charts */}
      <RatingChart data={userData} />

      {/* Topic Analysis */}
      <TopicAnalysis data={userData} />

      {/* Activity Calendar */}
      <ActivityCalendar data={userData} />
    </div>
  );
}

export default CodeDashboard;