interface ChatSidebarProps {
  messages: { from: 'user' | 'assistant'; text: string }[];
  draft: string;
  onDraft: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}

export default function ChatSidebar({ messages, draft, onDraft, onSend, loading }: ChatSidebarProps) {
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <div className="chat-title">CrimeGPT AI</div>
          <div className="chat-subtitle">Your right-hand AI assistant for case review and legal queries.</div>
        </div>
        <div className="chat-badge">AI</div>
      </div>
      <div className="chat-body">
        {messages.map((m: any, idx: number) => (
          <div key={idx} className={`chat-bubble ${m.from === 'assistant' ? 'assistant' : 'user'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <textarea
          className="chat-input"
          rows={3}
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          placeholder="Ask CrimeGPT about cases, reports, or legal guidance…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button className="btn btn-primary btn-sm" onClick={onSend} disabled={loading || !draft.trim()}>
          {loading ? (
            <>
              <span className="spin" />
              &nbsp;Thinking&hellip;
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </div>
    </div>
  );
}
