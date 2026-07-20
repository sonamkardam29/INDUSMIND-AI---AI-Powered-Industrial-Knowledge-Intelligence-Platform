import React, { useState, useEffect, useRef } from 'react';
import { sendChatQueryApi, fetchChatsApi } from '../services/api';
import { IChat, IMessage } from '../types';
import {
  Bot,
  Send,
  Mic,
  Volume2,
  Copy,
  Download,
  Check,
  FileText,
  Sparkles,
  Bookmark,
  Plus,
  Zap,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Flame,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'What is the emergency shutdown procedure for Gas Turbine GT-800?',
  'What are the pressure and thermal limits for Hydro-Cracker Reactor CR-200?',
  'How do I troubleshoot radial vibration exceeding 4.5 mm/s on Compressor C-102?',
  'What are the OSHA 1910 LOTO energy isolation requirements?',
];

export const CopilotPage: React.FC = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatsApi().then(c => {
      setChats(c);
      if (c.length > 0) {
        setCurrentChatId(c[0]._id);
        setMessages(c[0].messages);
      } else {
        // Preset sample initial welcome message
        setMessages([
          {
            id: 'msg-welcome',
            sender: 'assistant',
            content: `Hello! I am **INDUSMIND AI Knowledge Copilot**.\n\nI can answer questions regarding industrial SOPs, engineering manuals, maintenance logs, and OSHA/ISO compliance. All answers are strictly derived from your uploaded documents with verified citations, confidence scores, and page references.`,
            confidenceScore: 100,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (qText?: string) => {
    const query = qText || inputQuestion;
    if (!query.trim()) return;

    const userMsg: IMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!qText) setInputQuestion('');
    setLoading(true);

    try {
      const res = await sendChatQueryApi({
        question: query,
        chatId: currentChatId || undefined,
      });

      setMessages(prev => [...prev, res.message]);
      if (res.chatId && res.chatId !== currentChatId) {
        setCurrentChatId(res.chatId);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          content: 'I could not find this information in uploaded documents.',
          confidenceScore: 0,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported on this browser.');
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Speech Recognition requires Google Chrome or Microsoft Edge browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuestion(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  const handleExportChat = () => {
    const exportText = messages
      .map(m => `[${m.sender.toUpperCase()} - ${new Date(m.timestamp).toLocaleTimeString()}]\n${m.content}\n${m.confidenceScore ? `Confidence: ${m.confidenceScore}%\nSources: ${m.sourceDocs?.join(', ')}\n` : ''}\n-----------------------------------`)
      .join('\n\n');

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INDUSMIND_AI_Chat_Export_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Left History Sidebar */}
      <div className="w-64 glass-panel rounded-3xl border border-slate-800 p-4 hidden md:flex flex-col shrink-0">
        <button
          onClick={() => {
            setCurrentChatId(null);
            setMessages([
              {
                id: 'msg-welcome',
                sender: 'assistant',
                content: `New query session initialized. Ask anything about your industrial documents!`,
                confidenceScore: 100,
                timestamp: new Date().toISOString(),
              },
            ]);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center justify-center space-x-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>New Query Chat</span>
        </button>

        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
          Conversation History
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {chats.map(c => (
            <button
              key={c._id}
              onClick={() => {
                setCurrentChatId(c._id);
                setMessages(c.messages);
              }}
              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                currentChatId === c._id
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="truncate">{c.title}</div>
              <div className="text-[9px] text-slate-400 mt-1">{c.messages.length} messages</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex-1 glass-panel rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F17]/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>RAG AI Knowledge Copilot</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Anti-Hallucination Active
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Grounding model: Gemini 1.5 Flash + Cosine Similarity Vector Index</p>
            </div>
          </div>

          <button
            onClick={handleExportChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Chat</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-3xl p-5 border text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-950 to-emerald-950 border-cyan-500/40 text-slate-100 rounded-br-none'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-200 rounded-bl-none shadow-xl'
                }`}
              >
                {/* Confidence Badge & Header for AI */}
                {msg.sender === 'assistant' && msg.confidenceScore !== undefined && (
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] font-bold text-slate-300">Verified RAG Answer</span>
                    </div>
                    {msg.confidenceScore > 0 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {msg.confidenceScore}% Confidence Match
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Not Found in Docs
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-line font-sans">{msg.content}</div>

                {/* RAG Citations & Source Document Section */}
                {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 bg-[#070A11] p-3 rounded-2xl border border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Verified Citations & Page References</span>
                    </div>

                    {msg.citations.map((c, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300 bg-[#111724] p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between font-semibold text-cyan-300 mb-1">
                          <span>{c.documentTitle}</span>
                          <span className="text-slate-400 font-normal">Page {c.pageNumber}</span>
                        </div>
                        <div className="text-slate-400 italic text-[10px]">"{c.snippet}"</div>
                      </div>
                    ))}

                    {msg.relatedDocs && msg.relatedDocs.length > 0 && (
                      <div className="text-[10px] text-slate-400 pt-1">
                        <span className="font-semibold text-slate-300">Related Docs: </span>
                        {msg.relatedDocs.join(' • ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Actions */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/50">
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Read Aloud (TTS)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copy Answer"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0B0F17] border border-slate-800 p-4 rounded-3xl rounded-bl-none flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs text-slate-400 animate-pulse">Searching vector chunks & generating RAG answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="px-6 py-2 bg-[#070A11] border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Suggested:</span>
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Query Input Footer */}
        <div className="p-4 bg-[#0B0F17] border-t border-slate-800 flex items-center space-x-3">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-[#070A11] border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400'
            }`}
            title="Voice Search (Speech to Text)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about uploaded SOPs, manuals, or safety guidelines..."
            className="flex-1 bg-[#070A11] border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuestion.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold hover:opacity-90 transition-all shadow-glow-cyan disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
