import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useAuth } from '@clerk/clerk-react';
import ChallengeLeaderboard from '../components/ChallengeLeaderboard';
import ViewReplayModal from '../components/ViewReplayModal';

const socket = io('http://localhost:5000');

const ChallengePage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [loading, setLoading] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const [replayData, setReplayData] = useState(null);

  const fallbackImage =
    'https://res.cloudinary.com/dwfkxyeti/image/upload/v1755087763/fallback_m9xsvu.png' ||
    '/public/fallback.png';
  const storageKey = `challenge-code-${id}`;

  const htmlRef = useRef('');
  const cssRef = useRef('');
  const jsRef = useRef('');

  // ✅ Helper to get starter code from challenge schema
  const getStarterFrom = (c) => ({
    html: c?.starterCode?.html ?? c?.htmlStarter ?? '',
    css: c?.starterCode?.css ?? c?.cssStarter ?? '',
    js: c?.starterCode?.js ?? c?.jsStarter ?? '',
  });

  // 🧠 Fetch challenge + restore localStorage if exists
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
        const res = await axios.get(`http://localhost:5000/api/challenges/${id}`);
        const chall = res.data;
        setChallenge(chall);

        if (saved) {
          setHtml(saved.html || '');
          setCss(saved.css || '');
          setJs(saved.js || '');
        } else {
          const starter = getStarterFrom(chall);
          setHtml(starter.html);
          setCss(starter.css);
          setJs(starter.js);
        }
      } catch (err) {
        console.error('Failed to load challenge', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  // 🔄 Socket setup
  useEffect(() => {
    socket.emit('join-room', id);

    socket.on('code-update', ({ html, css, js }) => {
      if (html !== undefined) setHtml(html);
      if (css !== undefined) setCss(css);
      if (js !== undefined) setJs(js);
    });

    return () => {
      socket.emit('leave-room', id);
      socket.off('code-update');
    };
  }, [id]);

  // 💾 Auto-save code (every keystroke, debounce 500ms)
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        const code = { html, css, js };
        localStorage.setItem(storageKey, JSON.stringify(code));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [html, css, js, loading]);

  // 💾 Extra safeguard: save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const code = { html, css, js };
      localStorage.setItem(storageKey, JSON.stringify(code));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [html, css, js]);

  // 🧠 Code change
  const handleCodeChange = (lang, value) => {
    const safeVal = value ?? '';
    if (lang === 'html') {
      setHtml(safeVal);
      htmlRef.current = safeVal;
    } else if (lang === 'css') {
      setCss(safeVal);
      cssRef.current = safeVal;
    } else {
      setJs(safeVal);
      jsRef.current = safeVal;
    }

    socket.emit('code-change', {
      roomId: id,
      html: lang === 'html' ? safeVal : undefined,
      css: lang === 'css' ? safeVal : undefined,
      js: lang === 'js' ? safeVal : undefined,
    });
  };

  // 🔄 Reset with confirmation
  const handleReset = () => {
    if (!challenge) return;
    const confirmReset = window.confirm(
      'Are you sure you want to reset? Your current code will be lost.'
    );
    if (!confirmReset) return;

    const starter = getStarterFrom(challenge);

    setHtml(starter.html);
    setCss(starter.css);
    setJs(starter.js);

    // persist reset
    localStorage.setItem(storageKey, JSON.stringify(starter));

    // notify collaborators
    socket.emit('code-change', {
      roomId: id,
      html: starter.html,
      css: starter.css,
      js: starter.js,
    });

    toast.success('Code reset to starter template');
  };

  // 🚀 Submit code
  const handleSubmit = async () => {
    try {
      toast.loading('Submitting your code...', { id: 'submit' });

      const token = await getToken();
      const res = await axios.post(
        'http://localhost:5000/api/submissions',
        {
          challengeId: id,
          challengeTitle: challenge.title,
          html,
          css,
          js,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.dismiss('submit');

      if (res.data.success) {
        toast.success(`✅ Score: ${res.data.score} — ${res.data.feedback}`);
      } else {
        toast.error('❌ Submission failed. Try again.');
      }
    } catch (err) {
      toast.dismiss('submit');
      toast.error('Submission error');
    }
  };

  // 🧠 Generate preview
  const generateCode = () => `
    <!doctype html>
    <html>
      <head><meta charset="utf-8" /><style>${css}</style></head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;

  // 🔍 Replay modal
  const openReplay = (submission) => {
    setReplayData(submission);
    setShowReplay(true);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!challenge) return <div className="p-6 text-center text-red-600">Challenge not found.</div>;

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Hard: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left - Challenge Info */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
            difficultyColors[challenge.difficulty] || 'bg-gray-200 text-gray-700 border-gray-300'
          }`}
        >
          {challenge.difficulty}
        </span>
        <p className="text-gray-600 mt-4 mb-4">{challenge.description}</p>
        <img
          src={challenge.image || fallbackImage}
          alt={challenge.title}
          className="rounded-lg shadow mb-4"
        />
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>Use only HTML/CSS/JS</li>
          <li>Make it responsive</li>
        </ul>
      </div>

      {/* Right - Editor + Preview + Leaderboard */}
      <div className="w-full lg:w-2/3 p-4 flex flex-col">
        <div className="flex space-x-2 mb-2">
          {['html', 'css', 'js'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeTab === lang ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="h-64 mb-4 border border-gray-200 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            language={activeTab}
            theme="vs-dark"
            value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
            onChange={(value) => handleCodeChange(activeTab, value)}
          />
        </div>

        <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
        <iframe
          title="preview"
          className="flex-1 border border-gray-300 rounded-lg bg-white"
          srcDoc={generateCode()}
          sandbox="allow-scripts"
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
          >
            Submit Challenge
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Reset
          </button>
        </div>

        {/* 🏆 Leaderboard + Modal */}
        <ChallengeLeaderboard challengeId={id} onReplay={openReplay} />

        <ViewReplayModal
          isOpen={showReplay}
          onClose={() => setShowReplay(false)}
          submission={replayData}
        />
      </div>
    </div>
  );
};

export default ChallengePage;