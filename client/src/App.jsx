import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import CodeDashboard from './pages/CodeDashboard'
import ProfileDashboard from './pages/ProfileDashboard'
import EditProfile from './pages/EditProfile'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/codedashboard" element={<CodeDashboard />} />
        <Route path="/profiledashboard" element={<ProfileDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  )
}

export default App
