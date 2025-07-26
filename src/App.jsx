import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

import Home from './pages/Home';
import ChallengeList from './pages/ChallengeList';
import ChallengePage from './pages/ChallengePage';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

const RequireAuth = ({ children }) => {
  const { isSignedIn } = useUser();
  if (!isSignedIn) return <RedirectToSignIn />;
  return children;
};

const App = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/challenges" element={<ChallengeList />} />

      {/* Protected Routes */}
      <Route
        path="/challenges/:id"
        element={
          <RequireAuth>
            <ChallengePage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
    </Routes>
  </div>
);

export default App;