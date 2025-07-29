import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';

const ChallengePage = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [loading, setLoading] = useState(true);

  const storageKey = `challenge-code-${id}`;
  const fallbackImage = '/fallback.jpg';

  // Load challenge + restore saved code
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));

        if (saved) {
          setHtml(saved.html || '');
          setCss(saved.css || '');
          setJs(saved.js || '');
        }

        const res = await axios.get(`http://localhost:5000/api/challenges/${id}`);
        setChallenge(res.data);

        if (!saved) {
          setHtml(res.data.htmlStarter || '');
          setCss(res.data.cssStarter || '');
          setJs(res.data.jsStarter || '');
        }
      } catch (err) {
        console.error('Failed to load challenge', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        const code = { html, css, js };
        localStorage.setItem(storageKey, JSON.stringify(code));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [html, css, js, loading]);

  // Generate preview code
  const generateCode = () => `
    <html>
      <head><style>${css}</style></head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;

  // Handle submission
  const handleSubmit = async () => {
    try {
      toast.loading('Submitting your code...', { id: 'submit' });

      const res = await axios.post('http://localhost:5000/api/submissions', {
        challengeId: id,
        html,
        css,
        js,
      });

      toast.dismiss('submit');

      if (res.data.success) {
        toast.success(`✅ Score: ${res.data.score} — ${res.data.feedback}`);
      } else {
        toast.error('❌ Submission failed. Try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.dismiss('submit');
      toast.error('Something went wrong during submission.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!challenge) return <div className="p-6 text-center text-red-600">Challenge not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left - Challenge Info */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-4">{challenge.title}</h1>
        <p className="text-gray-600 mb-4">{challenge.description}</p>
        <img
          src={challenge.image || fallbackImage}
          alt={challenge.title}
          className="rounded-lg shadow mb-4"
        />
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>Difficulty: {challenge.difficulty}</li>
          <li>Use only HTML/CSS/JS</li>
          <li>Make it responsive</li>
        </ul>
      </div>

      {/* Right - Editor + Preview + Submit */}
      <div className="w-full lg:w-2/3 p-4 flex flex-col">
        {/* Tabs */}
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

        {/* Editor */}
        <div className="h-64 mb-4 border border-gray-200 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            language={activeTab}
            theme="vs-dark"
            value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
            onChange={(value) => {
              if (activeTab === 'html') setHtml(value);
              else if (activeTab === 'css') setCss(value);
              else setJs(value);
            }}
          />
        </div>

        {/* Preview */}
        <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
        <iframe
          title="preview"
          className="flex-1 border border-gray-300 rounded-lg bg-white"
          srcDoc={generateCode()}
          sandbox="allow-scripts"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 self-start bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Submit Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengePage;