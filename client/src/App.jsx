import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Profile from './pages/Profile'
import './App.css'

function Home() {
  return (
    <div className="App">
      <h1>Welcome</h1>
      <p>
        Go to the <Link to="/login">Login</Link> page, update your <Link to="/profile">Profile</Link>, or view the <Link to="/dashboard">Dashboard</Link>.
      </p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  )
}

export default App
