import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Auto-login without asking for username or password
    localStorage.setItem('role', 'manager');  // or 'agent' if u prefer
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f0f4f8',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#2980b9' }}>Loading...</h2>
    </div>
  );
}
