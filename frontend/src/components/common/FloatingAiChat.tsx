import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { ChatMessage, ChatStatus } from '../../types';
import {
  X,
  Minus,
  Maximize2,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'How do I set my financial goals?',
  'How can I find income opportunities?',
  'Explain my revenue calculation.',
  'How do I create a roadmap?',
  'How does FinPath protect my data?',
];

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: `### Welcome to FinPath Assistant 👋\n\nI am your educational financial guide. I can help you navigate:\n- **Setting realistic financial goals** & surplus analysis\n- **Discovering & validating real-world opportunities**\n- **Understanding revenue models, CAC & break-even targets**\n- **Creating step-by-step milestone roadmaps**\n\n*Important: I am an educational tool, not a certified financial advisor. My answers do not promise income or guarantee business success.*`,
  timestamp: 'Just now',
  notice: 'Local educational mode active. No private financial data is shared.',
};

export const FloatingAiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ChatStatus | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch chat status on mount
    api.getChatStatus()
      .then((res) => setStatus(res))
      .catch((err) => console.debug('Could not load chat status:', err));
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, loading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle ESC key to minimize or close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (!isMinimized) {
          setIsMinimized(true);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputMessage;
    const text = rawText.trim();
    if (!text || loading) return;

    if (text.length > 500) {
      setError('Message exceeds the 500 character limit.');
      return;
    }

    setError(null);
    const userMsg: ChatMessage = {
      id: createMessageId('user'),
      role: 'user',
      content: text,
      timestamp: formatCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build lightweight conversation history (last 4 messages, role & content only)
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content.slice(0, 300),
      }));

      const res = await api.sendChatMessage(text, history);

      const assistantMsg: ChatMessage = {
        id: createMessageId('asst'),
        role: 'assistant',
        content: res.reply,
        timestamp: formatCurrentTime(),
        notice: res.educationalNotice,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to connect to FinPath Assistant. Please try again.';
      setError(errorMsg);
      const fallbackMsg: ChatMessage = {
        id: createMessageId('err'),
        role: 'assistant',
        content: '⚠️ ' + errorMsg,
        timestamp: formatCurrentTime(),
        error: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderSimpleMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-display font-bold text-sm text-[#49362E] mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet list
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const item = line.trim().replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-[#49362E] my-0.5 leading-relaxed">
            {renderInlineMarkdown(item)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        const item = line.trim().replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-[#49362E] my-0.5 leading-relaxed">
            {renderInlineMarkdown(item)}
          </li>
        );
      }
      // Blockquote / callout
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-[#C74634] pl-2.5 my-1.5 text-[11px] text-[#79675E] italic bg-[#F6E9D8]/60 py-1 rounded-r">
            {renderInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-xs text-[#49362E] leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    // Simple inline parser for **bold**, *italic*, and `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-[#49362E]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-[#79675E]">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1 py-0.5 rounded bg-[#F4E2D9] text-[#9E3529] font-mono text-[10px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <aside
      className="fixed bottom-5 right-5 z-50 select-none print:hidden"
      aria-label="FinPath Assistant Chat"
    >
      {/* 1. Closed state: Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#C74634] hover:bg-[#9E3529] text-white shadow-warm hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-3 focus:ring-[#E7BFA9]"
          aria-label="Open FinPath Assistant"
          title="Open FinPath Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4BB543] rounded-full ring-2 ring-[#C74634]" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">Ask FinPath AI</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F6E9D8] opacity-80 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* 2. Minimized State */}
      {isOpen && isMinimized && (
        <div
          className="flex items-center gap-2 bg-[#FFF9F1] border border-[#E5D8CB] rounded-full px-4 py-2.5 shadow-lg text-xs text-[#49362E] cursor-pointer hover:border-[#C74634] transition-colors"
          onClick={() => setIsMinimized(false)}
        >
          <Bot className="w-4 h-4 text-[#C74634]" />
          <span className="font-semibold text-xs">FinPath Assistant</span>
          <span className="text-[10px] bg-[#DCE8DE] text-[#356B4B] px-1.5 py-0.5 rounded-full font-bold">Active</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            className="p-1 hover:text-[#C74634]"
            title="Restore chat window"
            aria-label="Restore chat window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="p-1 hover:text-[#C74634]"
            title="Close chat"
            aria-label="Close chat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Fully Expanded Chat Dialog */}
      {isOpen && !isMinimized && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="FinPath Assistant"
          className="w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] bg-[#FFF9F1] rounded-3xl border border-[#E5D8CB] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-[#F6E9D8] px-4 py-3.5 border-b border-[#E5D8CB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4E2D9] border border-[#E5D8CB] flex items-center justify-center text-[#C74634]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#49362E] leading-none">FinPath Assistant</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold bg-[#DCE8DE] text-[#356B4B]">
                    {status?.provider === 'external-ai' ? 'Cloud AI' : 'Local Edu'}
                  </span>
                </div>
                <p className="text-[10px] text-[#79675E] leading-none mt-1">Educational Planning Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#79675E]">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:text-[#49362E] hover:bg-[#E5D8CB]/50 rounded-lg transition-colors"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-[#C74634] hover:bg-[#E5D8CB]/50 rounded-lg transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Privacy & Safety Badge Banner */}
          <div className="bg-[#FFF9F1] px-3.5 py-1.5 border-b border-[#E5D8CB]/60 flex items-center justify-between text-[10px] text-[#79675E]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#356B4B]" />
              Private & Safe: Financial data never shared
            </span>
            <span className="text-[9px] text-[#79675E]/80">Esc to minimize</span>
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-left">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#F4E2D9] flex items-center justify-center text-[#C74634] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#C74634] text-white rounded-br-xs'
                      : msg.error
                      ? 'bg-[#F4E2D9] text-[#9E3529] border border-[#C74634]/30 rounded-bl-xs'
                      : 'bg-white border border-[#E5D8CB] text-[#49362E] rounded-bl-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div>{renderSimpleMarkdown(msg.content)}</div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] flex items-center justify-between gap-2 ${
                      msg.role === 'user' ? 'text-white/70' : 'text-[#79675E]/70'
                    }`}
                  >
                    {msg.notice && <span className="italic">{msg.notice}</span>}
                    <span className="ml-auto">{msg.timestamp}</span>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#E7BFA9] flex items-center justify-center text-[#49362E] shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-[#79675E]">
                <div className="w-6 h-6 rounded-full bg-[#F4E2D9] flex items-center justify-center text-[#C74634]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl border border-[#E5D8CB] shadow-2xs">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C74634] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C74634] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C74634] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] ml-1.5 text-[#79675E]">Consulting FinPath knowledge engine...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts (visible if conversation is short) */}
          {messages.length <= 3 && !loading && (
            <div className="px-3 pt-2 pb-1 border-t border-[#E5D8CB]/50 bg-[#FFF9F1]">
              <div className="text-[10px] font-bold text-[#79675E] uppercase tracking-wider mb-1.5 text-left flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C74634]" /> Suggested Questions:
              </div>
              <div className="flex flex-wrap gap-1.5 text-left">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#F6E9D8] text-[#49362E] hover:bg-[#F4E2D9] hover:text-[#C74634] border border-[#E5D8CB] transition-colors leading-tight text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Banner if any */}
          {error && (
            <div className="mx-3 my-1 p-2 rounded-xl bg-[#F4E2D9] border border-[#C74634]/30 text-[11px] text-[#9E3529] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}

          {/* Input Form Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#F6E9D8] border-t border-[#E5D8CB] flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                maxLength={500}
                disabled={loading}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about goals, calculator, roadmaps..."
                className="flex-1 px-3 py-2.5 rounded-full border border-[#E5D8CB] bg-white text-xs text-[#49362E] placeholder-[#79675E]/60 focus:outline-hidden focus:border-[#C74634] disabled:opacity-50"
                aria-label="Type your message to FinPath Assistant"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="w-9 h-9 rounded-full bg-[#C74634] hover:bg-[#9E3529] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 text-[9px] text-[#79675E]">
              <span>Educational guidance only. Not financial advice.</span>
              <span className={inputMessage.length > 450 ? 'text-[#C74634] font-bold' : ''}>
                {inputMessage.length}/500
              </span>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
