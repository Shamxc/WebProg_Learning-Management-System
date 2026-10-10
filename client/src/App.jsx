import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyLearning from './pages/MyLearning'
import Calendar from './pages/Calendar'
import Assessments from './pages/Assessments'
import Profile from './pages/Profile'
import MyCourses from './pages/MyCourses'
import Gradebook from './pages/Gradebook'
import Courses from './pages/Courses'
import Announcements from './pages/Announcements'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-learning" element={<MyLearning />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/my-courses" element={<MyCourses />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/assessments" element={<Assessments />} />
      <Route path="/gradebook" element={<Gradebook />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App