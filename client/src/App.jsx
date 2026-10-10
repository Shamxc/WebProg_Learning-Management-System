import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import Register from './pages/Register'

function App() {

  return (
    <>
      <Register/>
      <LoginPage/>
    </>
  )
}

export default App
