import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import MainApp from './MainApp'

export default function App() {
  const token = localStorage.getItem('token')


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/*"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
