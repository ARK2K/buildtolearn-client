import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from '@clerk/clerk-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [latestChallengeId, setLatestChallengeId] = useState(null);

  useEffect(() => {
    const storedChallengeId = localStorage.getItem('lastChallengeId');
    if (storedChallengeId) setLatestChallengeId(storedChallengeId);
  }, []);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Challenges', to: '/challenges' },
    { name: 'Dashboard', to: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          BuildToLearn
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 font-medium items-center relative">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* 🏆 Leaderboards with clickable toggle */}
          <li className="relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 cursor-pointer text-gray-700 hover:text-indigo-600 transition"
            >
              <span>Leaderboards</span>
              <span>{dropdownOpen ? '▲' : '▼'}</span>
            </div>
            {dropdownOpen && (
              <ul className="absolute top-full left-0 mt-2 w-56 bg-white border shadow-md rounded-lg py-1 z-50">
                <li>
                  <Link
                    to="/leaderboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🌍 Global Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={latestChallengeId ? `/leaderboard/${latestChallengeId}` : '/challenges'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    🧩 Challenge Leaderboard
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-3 font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-indigo-600 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {/* Leaderboards (mobile) */}
            <li>
              <Link
                to="/leaderboard"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-indigo-600 transition"
              >
                🌍 Global Leaderboard
              </Link>
            </li>
            <li>
              <Link
                to={latestChallengeId ? `/leaderboard/${latestChallengeId}` : '/challenges'}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-indigo-600 transition"
              >
                🧩 Challenge Leaderboard
              </Link>
            </li>

            <li>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full text-left bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;