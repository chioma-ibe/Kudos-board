import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Dashboard from './components/Dashboard'
import CreateBoard from './components/CreateBoard'
import BoardDetail from './components/BoardDetail'
import api from './services/api'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const data = await api.getBoards();
        setBoards(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching boards:', err);
        setError('Failed to load boards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={
              <Dashboard
                boards={boards}
                setBoards={setBoards}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                loading={loading}
                error={error}
              />
            } />
            <Route path="/create-board" element={
              <CreateBoard boards={boards} setBoards={setBoards} />
            } />
            <Route path="/board/:id" element={
              <BoardDetail boards={boards} setBoards={setBoards} />
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
