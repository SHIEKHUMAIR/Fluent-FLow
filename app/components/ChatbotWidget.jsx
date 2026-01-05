'use client';
import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL, API_PYTHON_URL } from '../../lib/config';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Language Guide. I can help you create a personalized learning roadmap. Ready to get started?" }
  ]);
  const [input, setInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  // Roadmap State
  const [roadmapState, setRoadmapState] = useState({
    active: false,
    phase: 'idle', // idle, profile, quiz, complete
    profile: {},   // { goal, time, selfLevel }
    quiz: {
      questions: [],
      currentIndex: 0,
      score: 0,
      strikes: 0
    },
    recommendation: null
  });

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const listRef = useRef(null);

  // Load Roadmap Data
  const [roadmapData, setRoadmapData] = useState(null);
  useEffect(() => {
    import('../../data/roadmapQuestions.json').then((data) => setRoadmapData(data));
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages, currentQuestion]);

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

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // --- Roadmap Logic ---

  const startRoadmap = () => {
    if (!roadmapData) return;
    // Reset PDF state when starting new roadmap
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfBlob(null);
    setPdfFileName('');
    setPdfUrl(null);
    setRoadmapState(prev => ({ ...prev, active: true, phase: 'profile' }));
    askProfileQuestion(0);
  };

  const askProfileQuestion = (index) => {
    const q = roadmapData.profile[index];
    if (q) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: q.text }]);
        setCurrentQuestion({ ...q, type: 'profile', index });
      }, 500);
    } else {
      // Profile complete, decide next step
      decideNextPhase();
    }
  };

  const decideNextPhase = () => {
    // Check self-assessed level
    const level = roadmapState.profile.selfLevel; // beginner/intermediate/advanced

    if (level === 'beginner') {
      // Direct Recommendation
      completeRoadmap('beginner');
    } else {
      // Trigger Assessment
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Since you have some experience, let's do a quick quiz to find your exact level. I'll ask a few questions - if you get 3 wrong, we'll stop there. Ready?"
        }]);
        startQuiz(level); // Start looking at questions for that level
      }, 500);
    }
  };

  const startQuiz = (level) => {
    // Load questions for the self-assessed level + adjacent?
    // For simplicity, let's load just that level's pool mostly
    const questions = roadmapData.assessment[level] || roadmapData.assessment['intermediate'];

    // Shuffle and pick 10? Or just take them
    const quizQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

    setRoadmapState(prev => ({
      ...prev,
      phase: 'quiz',
      quiz: { questions: quizQuestions, currentIndex: 0, score: 0, strikes: 0 }
    }));

    setTimeout(() => {
      askQuizQuestion(quizQuestions[0], 0);
    }, 1500);
  };

  const askQuizQuestion = (q, index) => {
    setMessages(prev => [...prev, { role: 'assistant', content: `Q${index + 1}: ${q.text}` }]);
    setCurrentQuestion({ ...q, type: 'quiz' });
  };

  const handleOptionClick = (option) => {
    // Add User Message
    setMessages(prev => [...prev, { role: 'user', content: option.label }]);
    setCurrentQuestion(null); // Clear options UI

    if (roadmapState.phase === 'profile') {
      // Save Answer
      const qIndex = currentQuestion.index;
      const key = roadmapData.profile[qIndex].id;

      setRoadmapState(prev => {
        const nextProfile = { ...prev.profile, [key]: option.value };
        return { ...prev, profile: nextProfile };
      });

      // Next Question
      askProfileQuestion(qIndex + 1);

    } else if (roadmapState.phase === 'quiz') {
      // Validate
      const isCorrect = option.correct;
      const feedback = isCorrect ? "Correct! 🎉" : "Not quite.";

      // Calculate next state values based on current render state
      // (Safe because buttons are hidden immediately via setCurrentQuestion(null))
      const currentQuiz = roadmapState.quiz;
      const nextScore = isCorrect ? currentQuiz.score + 1 : currentQuiz.score;
      const nextStrikes = isCorrect ? currentQuiz.strikes : currentQuiz.strikes + 1;
      const nextIndex = currentQuiz.currentIndex + 1;

      // Feedback Message
      setMessages(m => [...m, { role: 'assistant', content: feedback }]);

      // Check Exit Conditions
      if (nextStrikes >= 3) {
        // Early Exit -> Failed this level
        setTimeout(() => {
          completeRoadmap('downgrade');
        }, 1000);

        // Update state to inactive
        setRoadmapState(prev => ({ ...prev, active: false }));
        return;
      }

      if (nextIndex >= currentQuiz.questions.length) {
        // Finished all questions
        setTimeout(() => {
          completeRoadmap('finished', nextScore);
        }, 1000);

        // Update state to inactive
        setRoadmapState(prev => ({ ...prev, active: false }));
        return;
      }

      // Next Question Schedule
      setTimeout(() => {
        // We use the question from the CURRENT state's list, but at the NEXT index
        if (currentQuiz.questions[nextIndex]) {
          askQuizQuestion(currentQuiz.questions[nextIndex], nextIndex);
        }
      }, 1000);

      // Update State
      setRoadmapState(prev => ({
        ...prev,
        quiz: { ...prev.quiz, score: nextScore, strikes: nextStrikes, currentIndex: nextIndex }
      }));
    }
  };

  const completeRoadmap = async (status, score = 0) => {
    setIsGeneratingPDF(true);
    
    // Show generating message
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🎯 Analysis Complete! Generating your personalized roadmap PDF...'
    }]);

    try {
      // Get user info
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName') || 'Learner';

      if (!userId) {
        throw new Error('User ID not found. Please log in.');
      }

      // Collect all answers (profile + quiz answers if any)
      const answers = { ...roadmapState.profile };
      
      // Add quiz score if available
      if (roadmapState.quiz.score !== undefined) {
        answers.quizScore = roadmapState.quiz.score;
        answers.quizStrikes = roadmapState.quiz.strikes;
      }

      // Construct payload for Python API
      const payload = {
        userId: userId,
        answers: answers,
        userName: userName,
        backendUrl: API_BASE_URL
      };

      console.log('Generating Roadmap with payload:', payload);

      // Call Python API to generate PDF
      const response = await fetch(`${API_PYTHON_URL}/api/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/pdf'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorText = 'Failed to generate roadmap via Python API';
        try {
          const errorData = await response.json();
          errorText = errorData.detail || errorData.message || errorData.error || errorText;
        } catch {
          // If not JSON, try text
          try {
            errorText = await response.text();
          } catch {
            errorText = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        console.error('Roadmap generation error:', errorText);
        throw new Error(errorText);
      }

      // Store PDF blob for display in chat
      const blob = await response.blob();
      const fileName = `Roadmap_${userName.replace(/\s+/g, '_')}.pdf`;
      const blobUrl = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfFileName(fileName);
      setPdfUrl(blobUrl);

      // Show success message with PDF preview
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✅ Your personalized roadmap PDF is ready! Click the button below to download.',
        hasPDF: true
      }]);

    } catch (err) {
      console.error('Roadmap Generation Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${err.message}\n\nPlease try again or contact support.`
      }]);
    } finally {
      setIsGeneratingPDF(false);
      setRoadmapState(prev => ({ ...prev, active: false, phase: 'complete' }));
    }
  };

  if (!isAuthenticated) return null;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Normal chat if not in strict quiz mode (though we disable input in quiz usually)
    const next = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');

    if (!roadmapState.active && trimmed.toLowerCase().includes('roadmap') || trimmed.toLowerCase().includes('start')) {
      startRoadmap();
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: "I can help you build a roadmap. Type 'Start' to begin!" }]);
      }, 500);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDownloadPDF = () => {
    if (pdfBlob) {
      const a = document.createElement('a');
      a.href = pdfUrl || URL.createObjectURL(pdfBlob);
      a.download = pdfFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Floating Button */}
      <button
        className="fixed z-[61] bottom-6 right-6 w-14 h-14 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 01-4.39-1.14L3 21l1.14-4.61A9 9 0 1121 12z" /></svg>
        )}
      </button>

      {/* Chat Panel */}
      <div className={`fixed z-[62] bottom-24 right-6 w-[90vw] max-w-md bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden transition-all ${open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <div className="flex items-center justify-between px-4 py-3 bg-white/60 border-b border-white/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center">AI</div>
            <h3 className="text-sm font-semibold text-slate-800">Fluent Flow Assistant</h3>
          </div>
          <button className="text-slate-500 hover:text-slate-700" onClick={() => setOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] min-h-[40vh] overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.role === 'user' ? 'bg-blue-900 text-white rounded-2xl rounded-br-sm' : 'bg-white/80 text-slate-800 rounded-2xl rounded-bl-sm border border-white/40'} px-3 py-2 max-w-[85%] whitespace-pre-wrap shadow-sm`}>
                {m.content}
                {/* PDF Preview and Download Button */}
                {m.hasPDF && pdfBlob && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0">
                        <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{pdfFileName}</p>
                        <p className="text-xs text-slate-500">Your personalized learning roadmap</p>
                      </div>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex-shrink-0 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                    {/* PDF Preview iframe */}
                    {pdfUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                        <iframe
                          src={pdfUrl}
                          className="w-full h-64"
                          title="PDF Preview"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Loading indicator for PDF generation */}
          {isGeneratingPDF && (
            <div className="flex justify-start">
              <div className="bg-white/80 text-slate-800 rounded-2xl rounded-bl-sm border border-white/40 px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                  <span>Generating your roadmap PDF...</span>
                </div>
              </div>
            </div>
          )}
          {/* Options Renderer */}
          {currentQuestion && (
            <div className="flex flex-wrap gap-2 mt-2">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 text-sm px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-white/60 border-t border-white/40">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={!!currentQuestion} // Disable input when responding to quiz
              placeholder={currentQuestion ? "Please select an option above..." : "Type 'Start' for roadmap..."}
              className="flex-1 resize-none px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/40 bg-white/80 disabled:opacity-50"
              rows={1}
            />
            <button onClick={sendMessage} disabled={!!currentQuestion} className="px-4 py-2 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


