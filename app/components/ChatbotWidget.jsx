'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        setIsAuthenticated(Boolean(localToken || sessionToken));
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('userLoggedIn', checkAuth);
    window.addEventListener('profileUpdated', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userLoggedIn', checkAuth);
      window.removeEventListener('profileUpdated', checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && open) {
      setOpen(false);
    }
  }, [isAuthenticated, open]);

  if (!isAuthenticated) {
    return null;
  }

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');

    // Placeholder bot reply; integrate your API here
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'll get back to you on that!" }]);
    }, 400);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Backdrop with glass blur when open */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Button */}
      <button
        className="fixed z-[61] bottom-6 right-6 w-14 h-14 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chatbot"
      >
        {open ? (
          <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 01-4.39-1.14L3 21l1.14-4.61A9 9 0 1121 12z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed z-[62] bottom-24 right-6 w-[90vw] max-w-md bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden transition-all ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-white/60 border-b border-white/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center">AI</div>
            <h3 className="text-sm font-semibold text-slate-800">Fluent Flow Assistant</h3>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={() => setOpen(false)} aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] min-h-[40vh] overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`${
                  m.role === 'user'
                    ? 'bg-blue-900 text-white rounded-2xl rounded-br-sm'
                    : 'bg-white/80 text-slate-800 rounded-2xl rounded-bl-sm border border-white/40'
                } px-3 py-2 max-w-[75%] whitespace-pre-wrap`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white/60 border-t border-white/40">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="flex-1 resize-none px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40 bg-white/80"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


