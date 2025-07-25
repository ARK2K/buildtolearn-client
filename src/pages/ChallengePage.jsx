import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const ChallengePage = () => {
  const { id } = useParams();

  const [html, setHtml] = useState('<div>Hello UI Challenger!</div>');
  const [css, setCss] = useState('div { color: blue; font-size: 24px; }');
  const [js, setJs] = useState('');
  const [activeTab, setActiveTab] = useState('html');

  const generateCode = () => {
    return `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left - Challenge Description */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-4">Challenge Title</h1>
        <p className="text-gray-600 mb-4">
          Rebuild this UI using HTML, CSS, and JavaScript. You have limited time and resources.
        </p>
        <img
          src={`https://source.unsplash.com/featured/600x300?ui,design`}
          alt="Challenge Preview"
          className="rounded-lg shadow mb-4"
        />
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>Use only HTML/CSS/JS (no frameworks)</li>
          <li>Make it responsive</li>
          <li>Try to match the layout exactly</li>
        </ul>
      </div>

      {/* Right - Code Editor + Preview */}
      <div className="w-full lg:w-2/3 p-4 flex flex-col">
        {/* Editor Tabs */}
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
          className="flex-1 border rounded-lg bg-white"
          srcDoc={generateCode()}
          sandbox="allow-scripts"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default ChallengePage;