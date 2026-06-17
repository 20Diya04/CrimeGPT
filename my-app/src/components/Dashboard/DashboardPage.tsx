import { useState, useEffect } from 'react';
import { useLang } from '../../contexts/LangContext';
import { Ic } from '../../utils/icons';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import LangModal from '../common/LangModal';
import StatusBadge from '../common/StatusBadge';
import ChatSidebar from '../Chat/ChatSidebar';

type Tab = 'dashboard' | 'cases' | 'documents' | 'diary' | 'legal';

export default function DashboardPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [cases, setCases] = useState([
    { id: '1', number: 'CASE/2024/001', name: 'Vikram Singh', sections: 'BNS 303', items: 'Mobile Phone', statement: 'Theft at railway station', status: 'Active' },
    { id: '2', number: 'CASE/2024/002', name: 'Suresh Gupta', sections: 'BNS 61', items: 'Laptop, Hard Drive', statement: 'Burglary at residential premises', status: 'Closed' },
    { id: '3', number: 'CASE/2024/003', name: 'Ravi Kumar', sections: 'BNS 115', items: 'Cash ₹50,000', statement: 'Robbery at market area', status: 'Solved' },
    { id: '4', number: 'CASE/2024/004', name: 'Anjali Mehta', sections: 'BNS 420', items: 'Fake documents', statement: 'Fraud at government office', status: 'Unsolved' },
    { id: '5', number: 'CASE/2024/005', name: 'Rahul Sharma', sections: 'BNS 379', items: 'Stolen vehicle', statement: 'Attempted robbery and abduction', status: 'Open' },
  ]);
  const [docs, setDocs] = useState<any[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<any[]>([
    { id: 'd1', caseId: '1', caseNum: 'CASE/2024/001', title: 'Case registered', note: 'Initial FIR recorded and evidence logged.', date: '12 Jun 2024 09:10' },
    { id: 'd2', caseId: '2', caseNum: 'CASE/2024/002', title: 'Evidence logged', note: 'Laptop and hard drive entered into forensic review.', date: '12 Jun 2024 09:40' },
  ]);
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 'a1', time: '09:12', message: 'Officer signed in', caseId: '' },
    { id: 'a2', time: '09:45', message: 'Case CASE/2024/002 registered', caseId: '2' },
  ]);
  const [search, setSearch] = useState('');
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [docPreview, setDocPreview] = useState<any>(null);
  const [docType, setDocType] = useState('chargesheet');
  const [selCase, setSelCase] = useState('1');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [nc, setNc] = useState({ name: '', sections: '', items: '', statement: '' });
  const [ncErr, setNcErr] = useState('');
  const [newDiaryNote, setNewDiaryNote] = useState('');
  const [chatDraft, setChatDraft] = useState('');
  const [chatMessages, setChatMessages] = useState<{ from: 'user' | 'assistant'; text: string }[]>([
    { from: 'assistant', text: 'Hello Officer, I am CrimeGPT. Ask me about active cases, closed investigations, or legal suggestions.' },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [speechBuffer, setSpeechBuffer] = useState('');
  const [showLangSelector, setShowLangSelector] = useState(false);

  const { recording, supported: micSupported, error: micError, toggle: toggleMic, currentLanguage, changeLanguage, languageOptions } = useSpeechRecognition(
    (text: string, isFinal: boolean) => {
      if (isFinal) {
        setNewDiaryNote((prev) => {
          const newText = prev + (prev ? ' ' : '') + text;
          return newText.length > 5000 ? newText : newText;
        });
        setSpeechBuffer('');
      } else {
        setSpeechBuffer(text);
      }
    }
  );

  const getCurrentLangDisplay = () => {
    const lang = languageOptions.find((l) => l.code === currentLanguage);
    return lang ? `${lang.flag} ${lang.name}` : '🎤 Select Language';
  };

  useEffect(() => {
    if (cases.length && !cases.some((c) => c.id === selCase)) setSelCase(cases[0].id);
  }, [cases, selCase]);

  const selectedCase = cases.find((c) => c.id === selCase) || cases[0];
  const diaryForCase = selectedCase ? diaryEntries.filter((e) => e.caseId === selectedCase.id) : [];
  const statusCounts: Record<string, number> = {
    All: cases.length,
    Active: cases.filter((c) => c.status === 'Active').length,
    Closed: cases.filter((c) => c.status === 'Closed').length,
    Open: cases.filter((c) => c.status === 'Open').length,
    Solved: cases.filter((c) => c.status === 'Solved').length,
    Unsolved: cases.filter((c) => c.status === 'Unsolved').length,
  };

  const filtered = cases.filter(
    (c) =>
      (statusFilter === 'All' || c.status === statusFilter) &&
      (c.number.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sections.toLowerCase().includes(search.toLowerCase()))
  );

  const logAudit = (message: string, caseId: string = '') => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setAuditLogs((prev) => [{ id: Date.now().toString(), time, message, caseId }, ...prev].slice(0, 40));
  };

  const addDiaryEntry = (title: string, note: string) => {
    if (!selectedCase) return;
    if (!note.trim()) {
      alert('Please enter or speak a case note before adding.');
      return;
    }
    const entry = {
      id: Date.now().toString(),
      caseId: selectedCase.id,
      caseNum: selectedCase.number,
      title,
      note: note.trim(),
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setDiaryEntries((prev) => [entry, ...prev]);
    logAudit(`Diary update for ${selectedCase.number}: ${title}`, selectedCase.id);
    setNewDiaryNote('');
  };

  const delCase = (id: string) => {
    if (!window.confirm('Delete this case? This cannot be undone.')) return;
    const removed = cases.find((c) => c.id === id);
    setCases((prev) => prev.filter((c) => c.id !== id));
    setDiaryEntries((prev) => prev.filter((e) => e.caseId !== id));
    logAudit(`Case ${removed?.number || id} deleted`, id);
  };

  const addCase = () => {
    if (!nc.name || !nc.sections) {
      setNcErr('Accused Name and Sections are required.');
      return;
    }
    const num = `CASE/2024/${String(cases.length + 1).padStart(3, '0')}`;
    const created = { id: Date.now().toString(), number: num, ...nc, status: 'Active' };
    setCases((prev) => [...prev, created]);
    setShowCaseModal(false);
    setNc({ name: '', sections: '', items: '', statement: '' });
    setNcErr('');
    logAudit(`Case ${num} registered`, created.id);
  };

  const getLegalIntelligence = (c: any) => {
    if (!c) return [];
    const lines: string[] = [];
    const sections = c.sections.split(/[,;]+/).map((s: string) => s.trim()).filter(Boolean);
    sections.forEach((section: string) => {
      const id = section.toUpperCase();
      if (id.includes('303')) lines.push('BNS 303 — Theft: Recommend forensic digital evidence review and witness statements.');
      else if (id.includes('61')) lines.push('BNS 61 — Criminal breach of trust: Check property transfer records and custody chain.');
      else if (id.includes('115')) lines.push('BNS 115 — Murder: Priority should be evidence preservation and forensic support.');
      else if (id.includes('420')) lines.push('BNS 420 — Fraud: Secure all documentary evidence and initiate financial investigation.');
      else if (id.includes('379')) lines.push('BNS 379 — Robbery: Review CCTV footage and arrange suspect identification parade.');
      else lines.push(`${section}: Review relevant precedent and confirm prima facie evidence.`);
    });
    if (c.status === 'Closed' || c.status === 'Solved') {
      lines.push('Case resolved: verify final documents and ensure all records are securely archived.');
    } else {
      lines.push('Active investigation: keep witness summaries, CCTV logs and charge-sheet draft synchronised.');
    }
    return lines;
  };

  const generateChatReply = (question: string) => {
    const lower = question.toLowerCase();
    if (lower.includes('active')) return `There are ${statusCounts.Active} active records. Use the Active filter in Cases to review live investigations.`;
    if (lower.includes('closed')) return `${statusCounts.Closed} case(s) are closed/archived. Navigate to Cases and select the Closed filter.`;
    if (lower.includes('open')) return `${statusCounts.Open} case(s) are currently open. Click the Open filter under Cases to review.`;
    if (lower.includes('solved')) return `${statusCounts.Solved} case(s) are solved. Use the Solved filter under Cases.`;
    if (lower.includes('unsolved')) return `${statusCounts.Unsolved} case(s) remain unsolved and need attention.`;
    if (lower.includes('legal') || lower.includes('intelligence'))
      return selectedCase
        ? `Legal guidance for ${selectedCase.number}: ${getLegalIntelligence(selectedCase).join(' ')}`
        : 'Select a case to get specific legal intelligence.';
    if (lower.includes('case') && selectedCase)
      return `${selectedCase.number} — Status: ${selectedCase.status}. Accused: ${selectedCase.name}. Sections: ${selectedCase.sections}.`;
    if (lower.includes('help'))
      return 'Ask about active, closed, open, solved, or unsolved cases. I can also give legal intelligence on any selected case.';
    return 'I am ready to support you. Try asking about case status, legal intelligence, or evidence next steps.';
  };

  const handleAiSend = () => {
    const text = chatDraft.trim();
    if (!text) return;
    setChatMessages((prev) => [...prev, { from: 'user', text }]);
    setChatDraft('');
    setChatLoading(true);
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: 'assistant', text: generateChatReply(text) }]);
      setChatLoading(false);
    }, 700);
  };

  const genDoc = () => {
    if (!selectedCase) return;
    const c = selectedCase;
    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    let body = '';
    if (docType === 'chargesheet')
      body = `GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS\nPURVANI CHARGESHEET\n────────────────────────────────────────────────\nCASE NUMBER   : ${c.number}\nDATE          : ${date}\nPOLICE STATION: [Station Name]\n\nACCUSED       : ${c.name}\nSECTIONS      : ${c.sections}\nITEMS SEIZED  : ${c.items}\n\nSTATEMENT SUMMARY\n─────────────────\n${c.statement}\n\nSubmitted to the Honourable Court.\nSignature of I.O.: ______________________\nDesignation      : ______________________`;
    else if (docType === 'medical')
      body = `GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS\nMEDICAL EXAMINATION REQUEST\n────────────────────────────────────────────────\nTo, The Medical Superintendent / CMO\n\nCase No. : ${c.number}\nDate     : ${date}\nName     : ${c.name}\n\nPlease conduct a medical examination of the above individual\nin connection with the registered case and submit your report.\n\nAuthorised Signatory: ______________________`;
    else
      body = `GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS\nPOLICE CUSTODY REMAND REQUEST\n────────────────────────────────────────────────\nTo, The Honourable Magistrate\n\nCase No.  : ${c.number}\nDate      : ${date}\nAccused   : ${c.name}\nSections  : ${c.sections}\n\nREQUEST FOR 14-DAY POLICE CUSTODY REMAND\n\nThe accused requires police custody for further investigation,\ninterrogation and recovery of evidence and co-accused.\n\nSubmitted by : ______________________________\nRank         : ______________________________`;

    const doc = { id: Date.now().toString(), body, type: docType, caseNum: c.number, date };
    setDocs((prev) => [doc, ...prev]);
    setDocPreview(doc);
    setShowDocPreview(true);
    logAudit(`Document generated for ${c.number}`, c.id);
  };

  const diarySuggestions = [
    { title: 'Schedule court hearing', note: 'Create a hearing note and update prosecution team.', icon: <Ic.Calendar /> },
    { title: 'Log evidence transfer', note: 'Confirm receipt of forensic evidence and chain of custody.', icon: <Ic.File /> },
    { title: 'Notify legal team', note: 'Prepare charge-sheet draft and send for review.', icon: <Ic.Scale /> },
  ];

  const legalIntelligence = getLegalIntelligence(selectedCase);

  return (
    <div className="page">
      <Header nav={tab} onNav={setTab} />
      <div className="content page-grid" id="main-content">
        <div className="content-main">
          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <>
              <div className="page-title">
                <Ic.Dash />
                {t('dashboard')}
              </div>
              <div className="breadcrumb">
                Home <span className="breadcrumb-sep">›</span> <span>{t('dashboard')}</span>
              </div>
              <div className="status-filters">
                {(['All', 'Active', 'Open', 'Solved', 'Unsolved', 'Closed'] as const).map((key) => (
                  <button
                    key={key}
                    className={`status-chip ${statusFilter === key ? 'active' : ''}`}
                    onClick={() => { setStatusFilter(key); setTab('cases'); }}
                  >
                    <strong>{statusCounts[key]}</strong>
                    <span>{key}</span>
                  </button>
                ))}
              </div>
              <div className="card">
                <div className="card-head">
                  <span className="card-title"><Ic.Folder />Recent Cases</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setTab('cases')}>
                    <Ic.ChevR />View All
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Case No.</th><th>Accused</th><th>Sections</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {cases.slice(0, 5).map((c) => (
                        <tr key={c.id}>
                          <td><span className="case-no">{c.number}</span></td>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td><span className="tag">{c.sections}</span></td>
                          <td><StatusBadge status={c.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <div className="card-head">
                  <span className="card-title"><Ic.Alert />{t('auditLog')}</span>
                </div>
                <div className="card-body">
                  {auditLogs.slice(0, 6).map((a) => (
                    <div key={a.id} className="audit-row">
                      <div className="audit-msg">{a.message}</div>
                      <div className="audit-time">{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── CASES ── */}
          {tab === 'cases' && (
            <>
              <div className="page-title"><Ic.Folder />{t('cases')}</div>
              <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('cases')}</span></div>
              <div className="toolbar">
                <div className="search-box">
                  <Ic.Search />
                  <input type="text" placeholder="Search by case no., name, section…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={() => setShowCaseModal(true)}>
                  <Ic.Plus />{t('newCase')}
                </button>
              </div>
              <div className="status-filters" style={{ marginBottom: 16 }}>
                {(['All', 'Active', 'Open', 'Solved', 'Unsolved', 'Closed'] as const).map((key) => (
                  <button key={key} className={`status-chip ${statusFilter === key ? 'active' : ''}`} onClick={() => setStatusFilter(key)}>
                    <strong>{statusCounts[key]}</strong><span>{key}</span>
                  </button>
                ))}
              </div>
              <div className="filter-bar">
                <div>Showing <strong>{statusFilter}</strong> cases — {filtered.length} record(s)</div>
                {statusFilter !== 'All' && (
                  <button className="btn btn-outline btn-sm" onClick={() => setStatusFilter('All')}>Clear filter</button>
                )}
              </div>
              {filtered.length === 0 ? (
                <div className="empty"><Ic.Folder /><h3>No cases found</h3><p>Try a different search or register a new case.</p></div>
              ) : (
                <div className="card">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Case No.</th><th>Accused</th><th>Sections</th><th>Evidence / Items</th><th>Summary</th><th>Status</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {filtered.map((c) => (
                          <tr key={c.id}>
                            <td><span className="case-no">{c.number}</span></td>
                            <td style={{ fontWeight: 600 }}>{c.name}</td>
                            <td><span className="tag">{c.sections}</span></td>
                            <td style={{ fontSize: 13 }}>{c.items}</td>
                            <td style={{ fontSize: 13, maxWidth: 180, color: 'var(--gray-600)' }}>{c.statement}</td>
                            <td><StatusBadge status={c.status} /></td>
                            <td>
                              <button className="btn btn-ghost-red btn-sm" onClick={() => delCase(c.id)}>
                                <Ic.Trash />Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── DOCUMENTS ── */}
          {tab === 'documents' && (
            <>
              <div className="page-title"><Ic.FileOut />{t('documents')}</div>
              <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('documents')}</span></div>
              <div className="card" style={{ marginBottom: 22 }}>
                <div className="card-head"><span className="card-title"><Ic.File />Generate Document</span></div>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1, minWidth: 200, margin: 0 }}>
                      <label className="form-label">Select Case</label>
                      <select className="form-input" value={selCase} onChange={(e) => setSelCase(e.target.value)}>
                        {cases.map((c) => (
                          <option key={c.id} value={c.id}>{c.number} — {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: 200, margin: 0 }}>
                      <label className="form-label">Document Type</label>
                      <select className="form-input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                        <option value="chargesheet">Purvani Chargesheet</option>
                        <option value="medical">Medical Examination Letter</option>
                        <option value="remand">Remand Request</option>
                      </select>
                    </div>
                    <button className="btn btn-primary" onClick={genDoc} style={{ flexShrink: 0 }}>
                      <Ic.FileOut />{t('generateDoc')}
                    </button>
                  </div>
                </div>
              </div>
              {docs.length === 0 ? (
                <div className="empty"><Ic.File /><h3>No documents yet</h3><p>Select a case and document type above, then click Generate.</p></div>
              ) : (
                docs.map((d, i) => (
                  <div key={d.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>
                        📄 Document #{i + 1} — {d.caseNum} <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>({d.date})</span>
                      </span>
                      <button className="btn btn-ghost-red btn-sm" onClick={() => setDocs((prev) => prev.filter((x) => x.id !== d.id))}>
                        <Ic.Trash />Remove
                      </button>
                    </div>
                    <pre className="doc-pre">{d.body}</pre>
                  </div>
                ))
              )}
            </>
          )}

          {/* ── DIARY ── */}
          {tab === 'diary' && (
            <>
              <div className="page-title"><Ic.Book />{t('diary')}</div>
              <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('diary')}</span></div>
              <div className="card" style={{ marginBottom: 22 }}>
                <div className="card-head"><span className="card-title"><Ic.Check />{t('autoDiary')}</span></div>
                <div className="card-body">
                  <div style={{ display: 'grid', gap: 10 }}>
                    {diarySuggestions.map((s) => (
                      <button key={s.title} className="suggestion-btn" onClick={() => addDiaryEntry(s.title, s.note)}>
                        <div className="suggestion-btn-icon">{s.icon}</div>
                        <div>
                          <div className="suggestion-btn-title">{s.title}</div>
                          <div className="suggestion-btn-sub">{s.note}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', color: 'var(--gray-300)' }}>
                          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card" style={{ marginBottom: 22 }}>
                <div className="card-head">
                  <span className="card-title"><Ic.Plus />Add Diary Entry</span>
                  {micSupported && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      {recording && (
                        <div className="mic-status">
                          <div className="mic-dot" />
                          <span style={{ color: 'var(--red)' }}>🔴 Recording...</span>
                        </div>
                      )}
                      <div style={{ position: 'relative' }}>
                        <button
                          className="btn-outline btn-sm"
                          onClick={() => setShowLangSelector(!showLangSelector)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px' }}
                        >
                          <span>{getCurrentLangDisplay()}</span>
                          <span>▼</span>
                        </button>
                        {showLangSelector && (
                          <div className="language-dropdown">
                            {languageOptions.map((lang) => (
                              <button
                                key={lang.code}
                                className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                onClick={() => { changeLanguage(lang.code); setShowLangSelector(false); }}
                              >
                                <span className="language-flag">{lang.flag}</span>
                                <div>
                                  <div className="language-name">{lang.name}</div>
                                  <div className="language-native">{lang.nativeName}</div>
                                </div>
                                {currentLanguage === lang.code && <span className="language-check">✓</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className={`btn-mic ${recording ? 'recording' : ''}`} onClick={toggleMic}>
                        {recording ? <Ic.MicOff /> : <Ic.Mic />}
                        {recording ? 'Stop Recording' : 'Speak to Type'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  {micSupported && (
                    <div className="alert alert-info" style={{ marginBottom: 14 }}>
                      <Ic.Mic />
                      <div>
                        <strong>Voice Dictation Available</strong> — Click <em>Speak to Type</em> and speak your case notes aloud.
                        <span style={{ display: 'block', marginTop: '4px' }}>
                          🎤 <strong>Supported Languages:</strong> Hindi, English, Gujarati, Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, Punjabi
                          <br />📌 <strong>Current:</strong> {getCurrentLangDisplay()}
                        </span>
                      </div>
                    </div>
                  )}
                  {micError && (
                    <div className="alert alert-error" style={{ marginBottom: 14 }}>
                      <Ic.Alert /> {micError}
                    </div>
                  )}
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">CASE NOTE / ACTIVITY DESCRIPTION</label>
                    <textarea
                      className="form-input"
                      rows={6}
                      placeholder={recording ? '🎤 Listening... Speak now...' : 'Type your case note here or click "Speak to Type" for voice dictation...'}
                      value={recording && speechBuffer ? newDiaryNote + (newDiaryNote ? ' ' : '') + speechBuffer : newDiaryNote}
                      onChange={(e) => setNewDiaryNote(e.target.value)}
                      style={{ borderColor: recording ? 'var(--red)' : undefined }}
                    />
                    {recording && (
                      <div className="alert alert-success" style={{ marginTop: '8px', padding: '6px 12px' }}>
                        <div className="mic-dot" style={{ display: 'inline-block', marginRight: '8px' }} />
                        <span>🔴 Recording active - Speaking in {languageOptions.find((l) => l.code === currentLanguage)?.name}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => {
                      if (!newDiaryNote.trim()) { alert('Please enter or speak a case note before adding.'); return; }
                      addDiaryEntry('Case Note Entry', newDiaryNote.trim());
                    }}>
                      <Ic.Plus /> Add Entry
                    </button>
                    {newDiaryNote && (
                      <button className="btn btn-outline btn-sm" onClick={() => setNewDiaryNote('')}>Clear</button>
                    )}
                  </div>
                  <div style={{ marginTop: '16px', padding: '10px', background: 'var(--gray-50)', borderRadius: 'var(--r-sm)', fontSize: '11px' }}>
                    <strong>💡 Tips:</strong> Select language from dropdown, click mic, speak clearly, then Add Entry.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-head"><span className="card-title"><Ic.Calendar />Timeline — {selectedCase?.number}</span></div>
                <div className="card-body">
                  {diaryForCase.length === 0 ? (
                    <div className="empty"><Ic.Book /><h3>No diary entries yet</h3></div>
                  ) : (
                    diaryForCase.map((entry) => (
                      <div key={entry.id} className="diary-entry">
                        <div className="diary-entry-title">{entry.title}</div>
                        <div className="diary-entry-date">📅 {entry.date}</div>
                        <div className="diary-entry-note">{entry.note}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── LEGAL ── */}
          {tab === 'legal' && (
            <>
              <div className="page-title"><Ic.Scale />{t('legal')}</div>
              <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('legal')}</span></div>
              <div className="card" style={{ marginBottom: 22 }}>
                <div className="card-head"><span className="card-title"><Ic.Folder />{t('caseDetails')}</span></div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                      <label className="form-label">Case Number</label>
                      <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{selectedCase?.number}</div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                      <label className="form-label">Accused</label>
                      <div style={{ fontWeight: 600 }}>{selectedCase?.name}</div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Sections</label>
                      <div><span className="tag">{selectedCase?.sections}</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                      <label className="form-label">Evidence / Items</label>
                      <div style={{ fontSize: 13 }}>{selectedCase?.items}</div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                      <label className="form-label">Status</label>
                      <div><StatusBadge status={selectedCase?.status || ''} /></div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Case Summary</label>
                      <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{selectedCase?.statement}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-head"><span className="card-title"><Ic.Alert />{t('legalGuide')}</span></div>
                <div className="card-body">
                  {legalIntelligence.map((line, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: idx < legalIntelligence.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,51,102,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)' }}>{idx + 1}</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}>{line}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <ChatSidebar messages={chatMessages} draft={chatDraft} onDraft={setChatDraft} onSend={handleAiSend} loading={chatLoading} />
      </div>

      <Footer />
      <LangModal />

      {showCaseModal && (
        <div className="overlay" onClick={() => { setShowCaseModal(false); setNcErr(''); }}>
          <div className="modal" style={{ maxWidth: 510 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3><Ic.Plus />Register New Case</h3>
              <button className="modal-x" onClick={() => { setShowCaseModal(false); setNcErr(''); }}><Ic.X /></button>
            </div>
            <div className="modal-body">
              {ncErr && <div className="alert alert-error"><Ic.Alert />{ncErr}</div>}
              <div className="form-group">
                <label className="form-label">{t('accusedName')} *</label>
                <input className="form-input" placeholder="Full name of accused" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('sections')} *</label>
                <input className="form-input" placeholder="e.g. BNS 303, BNS 61" value={nc.sections} onChange={(e) => setNc({ ...nc, sections: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('itemsSeized')}</label>
                <input className="form-input" placeholder="e.g. Mobile Phone, Laptop" value={nc.items} onChange={(e) => setNc({ ...nc, items: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('statement')}</label>
                <textarea className="form-input" rows={3} placeholder="Brief FIR / case summary…" value={nc.statement} onChange={(e) => setNc({ ...nc, statement: e.target.value })} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline btn-sm" onClick={() => { setShowCaseModal(false); setNcErr(''); }}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={addCase}><Ic.Plus />{t('createCase')}</button>
            </div>
          </div>
        </div>
      )}

      {showDocPreview && docPreview && (
        <div className="overlay" onClick={() => setShowDocPreview(false)}>
          <div className="modal" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3><Ic.File />Document Preview — {docPreview.caseNum}</h3>
              <button className="modal-x" onClick={() => setShowDocPreview(false)}><Ic.X /></button>
            </div>
            <div className="modal-body">
              <pre className="doc-pre" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 13 }}>{docPreview.body}</pre>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline btn-sm" onClick={() => setShowDocPreview(false)}>Close</button>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
