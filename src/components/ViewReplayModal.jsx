import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const ViewReplayModal = ({ isOpen, onClose, submission }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [previewKey, setPreviewKey] = useState(0); // force iframe refresh

  useEffect(() => {
    if (isOpen) {
      setActiveTab('html');
      setPreviewKey((k) => k + 1); // reset preview when modal opens
    }
  }, [isOpen, submission]);

  if (!isOpen || !submission) return null;

  const { html = '', css = '', js = '', username, score } = submission;

  const generateCode = () => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-4 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            🕹️ Replay: {username || 'Anonymous'} — Score: {score}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-2">
          {['html', 'css', 'js'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                activeTab === lang
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="h-56 border rounded mb-4 overflow-hidden">
          <Editor
            height="100%"
            language={activeTab}
            theme="vs-dark"
            value={
              activeTab === 'html' ? html : activeTab === 'css' ? css : js
            }
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
        </div>

        {/* Preview */}
        <h3 className="text-sm font-medium mb-1">Live Preview</h3>
        <iframe
          key={previewKey}
          className="flex-1 border rounded bg-white"
          srcDoc={generateCode()}
          title="Replay Preview"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default ViewReplayModal;