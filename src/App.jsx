import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChallengeList from './pages/ChallengeList';
import Navbar from './components/Navbar';

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenges" element={<ChallengeList />} />
      </Routes>
    </div>
  </Router>
);

export default App;