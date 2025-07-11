import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainApp from './MainApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}