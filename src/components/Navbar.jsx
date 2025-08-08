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

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Challenges', to: '/challenges' },
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Global Leaderboard', to: '/leaderboard' },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          BuildToLearn
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 font-medium items-center">
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

          <li>
            <SignedIn>
              <UserButton/>
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
            <li>
              <SignedIn>
                <UserButton/>
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