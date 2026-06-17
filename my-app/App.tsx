import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { API_BASE, authRequest, apiRequest, downloadFile } from './api';

const LangContext = createContext({ lang: 'en', setLang: (value: string) => {} });
const AuthContext = createContext<any>(null);

const documentTypes = [
  { key: 'chargesheet', label: 'Purvani Chargesheet' },
  { key: 'medical', label: 'Medical Treatment Letter' },
  { key: 'remand', label: 'Remand Request Letter' },
  { key: 'seizure', label: 'Seizure Receipt' },
  { key: 'custody', label: 'Court Custody Letter' },
  { key: 'panchanama', label: 'Accused Panchanama' },
  { key: 'faceId', label: 'Face Identification Form' },
];

const translations: Record<string, Record<string, string>> = {
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', gu: 'ડેશબોર્ડ' },
  cases: { en: 'Cases', hi: 'मामले', gu: 'કેસો' },
  documents: { en: 'Documents', hi: 'दस्तावेज़', gu: 'દસ્તાવેજો' },
  evidence: { en: 'Evidence', hi: 'सबूत', gu: 'સબૂત' },
  legal: { en: 'Legal Intelligence', hi: 'कानूनी बुद्धिमत्ता', gu: 'કાયદાકીય બુદ્ધિ' },
  login: { en: 'Login', hi: 'लॉगिन', gu: 'લોગિન' },
  email: { en: 'Email', hi: 'ईमेल', gu: 'ઇમેઇલ' },
  password: { en: 'Password', hi: 'पासवर्ड', gu: 'પાસવર્ડ' },
  signIn: { en: 'Sign In', hi: 'साइन इन', gu: 'સાઇન ઇન' },
  search: { en: 'Search', hi: 'खोजें', gu: 'શોધ' },
  pending: { en: 'Pending Cases', hi: 'लंबित मामले', gu: 'લંબિત કેસો' },
  arrested: { en: 'Arrested Cases', hi: 'गिरफ्तार मामले', gu: 'ગેઠાયેલા કેસો' },
  chargesheet: { en: 'Chargesheet Filed', hi: 'चार्जशीट दाखिल', gu: 'ચાર્જશીટ દાખલ' },
  activities: { en: 'Recent Activities', hi: 'हाल की गतिविधियाँ', gu: 'તાજેતરના પ્રવૃત્તિઓ' },
  totalCases: { en: 'Total Cases', hi: 'कुल मामले', gu: 'કુલ કેસો' },
};

const useTranslation = () => {
  const { lang } = useContext(LangContext);
  return (key: string) => translations[key]?.[lang] || key;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('crimegpt_token'));
  const [user, setUser] = useState<any>(localStorage.getItem('crimegpt_user') ? JSON.parse(localStorage.getItem('crimegpt_user')!) : null);

  const login = async (email: string, password: string) => {
    const response = await authRequest('login', { email, password });
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('crimegpt_token', response.token);
      localStorage.setItem('crimegpt_user', JSON.stringify(response.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('crimegpt_token');
    localStorage.removeItem('crimegpt_user');
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const UseAuth = () => useContext(AuthContext);

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = UseAuth();
  if (!auth?.token) return <Navigate to="/login" replace />;
  return children;
};

const LanguageSwitcher = () => {
  const { lang, setLang } = useContext(LangContext);
  return (
    <div className="flex gap-2 items-center">
      {['en', 'hi', 'gu'].map((code) => (
        <button key={code} className={`px-3 py-1 rounded ${lang === code ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => setLang(code)}>{code.toUpperCase()}</button>
      ))}
    </div>
  );
};

const Header = () => {
  const auth = UseAuth();
  const t = useTranslation();
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold">CrimeGPT Government Portal</h1>
          <p className="text-sm text-slate-300">Investigation and documentation management for police and prosecution teams.</p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {auth?.user ? <button onClick={auth.logout} className="rounded bg-amber-500 px-4 py-2 text-slate-900 font-semibold">Logout</button> : null}
        </div>
      </div>
    </header>
  );
};

const Sidebar = () => {
  const t = useTranslation();
  return (
    <aside className="w-full max-w-xs space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
      <nav className="space-y-2">
        {[
          { label: t('dashboard'), path: '/' },
          { label: t('cases'), path: '/cases' },
          { label: t('documents'), path: '/documents' },
          { label: t('evidence'), path: '/evidence' },
          { label: t('legal'), path: '/legal' },
        ].map((item) => (
          <Link key={item.path} to={item.path} className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">{item.label}</Link>
        ))}
      </nav>
    </aside>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = UseAuth();
  const navigate = useNavigate();
  const t = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const ok = await auth.login(email, password);
    if (ok) navigate('/'); else setError('Unable to authenticate.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-semibold">{t('login')}</h2>
        <p className="mt-2 text-sm text-slate-500">Secure access for investigating officers and supervisors.</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t('email')}</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" placeholder="officer@gov.in" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t('password')}</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" placeholder="••••••••" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">{t('signIn')}</button>
        </form>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [summary, setSummary] = useState({ total: 0, pending: 0, arrested: 0, chargesheet: 0 });
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const t = useTranslation();

  useEffect(() => {
    setSummary({ total: 28, pending: 16, arrested: 6, chargesheet: 8 });
    setRecentActivity([
      'Case CASE/2025/018 updated with witness statement.',
      'Evidence file uploaded to CASE/2025/007.',
      'Chargesheet generated for CASE/2025/004.',
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        {[
          { label: t('totalCases'), value: summary.total, accent: 'bg-slate-900', icon: '📁' },
          { label: t('pending'), value: summary.pending, accent: 'bg-amber-500', icon: '⏳' },
          { label: t('arrested'), value: summary.arrested, accent: 'bg-emerald-500', icon: '🚨' },
          { label: t('chargesheet'), value: summary.chargesheet, accent: 'bg-indigo-500', icon: '🧾' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white ${stat.accent}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold">{t('activities')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {recentActivity.map((item, idx) => (
              <li key={idx} className="rounded-2xl bg-slate-50 p-4">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold">AI Case Guidance</h3>
          <p className="mt-3 text-sm text-slate-600">The portal automatically analyzes each complaint and suggests legal sections, investigative actions, and document templates for field officers.</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium">Suggested sections</p>
              <p className="mt-2 text-sm text-slate-700">BNS 303, BNS 304, BSA 137</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium">Next action</p>
              <p className="mt-2 text-sm text-slate-700">Collect witness statements and secure CCTV evidence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CasesPage = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiRequest(`/cases?search=${encodeURIComponent(search)}`)
      .then((data) => setCases(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Case Management</h2>
          <p className="text-sm text-slate-500">Search and review unified case records across the investigation lifecycle.</p>
        </div>
        <Link to="/cases/new" className="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">New Case</Link>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
        <div className="mb-4 flex items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search case no., accused, victim" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left uppercase">Case No.</th>
                <th className="px-4 py-3 text-left">Accused</th>
                <th className="px-4 py-3 text-left">Victim</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Loading cases…</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No cases found.</td></tr>
              ) : cases.map((caseItem) => (
                <tr key={caseItem._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{caseItem.caseNumber}</td>
                  <td className="px-4 py-4">{caseItem.accused?.name}</td>
                  <td className="px-4 py-4">{caseItem.victim?.name}</td>
                  <td className="px-4 py-4">{caseItem.status}</td>
                  <td className="px-4 py-4"><Link to={`/cases/${caseItem._id}`} className="text-slate-900 font-semibold hover:text-slate-700">Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CaseDetailPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const [logNote, setLogNote] = useState('');

  useEffect(() => {
    if (!id) return;
    apiRequest(`/cases/${id}`).then((data) => setRecord(data));
  }, [id]);

  const addLog = async () => {
    if (!id || !logNote) return;
    const response = await apiRequest(`/cases/${id}/diary`, 'POST', { event: 'Activity log', details: logNote });
    setRecord(response);
    setLogNote('');
  };

  if (!record) return <div className="p-6 rounded-3xl bg-white shadow-sm border border-slate-200">Loading case details…</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{record.caseNumber}</h2>
            <p className="text-sm text-slate-500">{record.accused?.name} vs {record.victim?.name}</p>
          </div>
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Status: {record.status}</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Accused</h3>
            <p className="mt-3 text-slate-700">{record.accused?.name}</p>
            <p className="text-sm text-slate-500">{record.accused?.address}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase text-slate-500">Victim</h3>
            <p className="mt-3 text-slate-700">{record.victim?.name}</p>
            <p className="text-sm text-slate-500">{record.victim?.contact}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold">Incident Summary</h3>
          <p className="mt-4 text-slate-600 whitespace-pre-line">{record.statement}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-2 font-semibold text-slate-900">{record.crimeLocation}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Legal Sections</p>
              <p className="mt-2 font-semibold text-slate-900">{record.legalSections?.join(', ')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold">Case Diary</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {record.diary?.map((entry: any, index: number) => (
              <div key={index} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{entry.event}</p>
                <p>{entry.details}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(entry.date).toLocaleString()} by {entry.officer}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <textarea value={logNote} onChange={(e) => setLogNote(e.target.value)} rows={3} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Add investigation log entry" />
            <button onClick={addLog} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Add Diary Entry</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentsPage = () => {
  const [caseId, setCaseId] = useState('');
  const [type, setType] = useState('chargesheet');
  const [format, setFormat] = useState('pdf');
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    apiRequest('/cases').then((data) => setCases(Array.isArray(data) ? data : []));
  }, []);

  const generate = async () => {
    if (!caseId) return;
    await downloadFile('/documents/generate', { caseId, type, format });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Case</span>
              <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                <option value="">Select a case</option>
                {cases.map((caseItem) => <option key={caseItem._id} value={caseItem._id}>{caseItem.caseNumber}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Document type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                {documentTypes.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
            </label>
          </div>
          <button onClick={generate} className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900">Generate & Download</button>
        </div>
      </div>
    </div>
  );
};

const EvidencePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caseId, setCaseId] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    apiRequest('/cases').then((data) => setCases(Array.isArray(data) ? data : []));
  }, []);

  const upload = async () => {
    if (!file || !caseId) return;
    const formData = new FormData();
    formData.append('evidence', file);
    formData.append('label', file.name);

    const token = localStorage.getItem('crimegpt_token');
    const response = await fetch(`${API_BASE}/upload/${caseId}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (response.ok) setStatus('Uploaded successfully'); else setStatus('Upload failed');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-semibold">Evidence Management</h2>
        <p className="mt-2 text-sm text-slate-500">Upload supporting evidence and maintain a chain of custody for each file.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3">
            <option value="">Select case</option>
            {cases.map((caseItem) => <option key={caseItem._id} value={caseItem._id}>{caseItem.caseNumber}</option>)}
          </select>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3" />
          <button onClick={upload} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white">Upload Evidence</button>
        </div>
        {status && <p className="mt-4 text-sm text-emerald-700">{status}</p>}
      </div>
    </div>
  );
};

const LegalAIPage = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    const fake = { sections: ['BNS 115', 'BSA 159'], judgments: ['State v. Patel (2025)'], crossReferences: ['CrPC 154'] };
    setResult(fake);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-semibold">{translations.legal.en}</h2>
        <p className="mt-2 text-sm text-slate-500">Use the AI complaint analyzer to extract accused, victim, location, evidence, and legal provisions.</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mt-6 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm" placeholder="Paste case summary here." />
        <button onClick={analyze} className="mt-4 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900">Analyze Complaint</button>
      </div>
      {result && (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold">AI Suggestions</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Sections</p>
              <p className="mt-2 text-slate-900">{result.sections.join(', ')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Judgments</p>
              <p className="mt-2 text-slate-900">{result.judgments.join(', ')}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Cross refs</p>
              <p className="mt-2 text-slate-900">{result.crossReferences.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState<'en'|'hi'|'gu'>('en');

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
              <Sidebar />
              <main className="space-y-6">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                  <Route path="/cases" element={<PrivateRoute><CasesPage /></PrivateRoute>} />
                  <Route path="/cases/:id" element={<PrivateRoute><CaseDetailPage /></PrivateRoute>} />
                  <Route path="/documents" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
                  <Route path="/evidence" element={<PrivateRoute><EvidencePage /></PrivateRoute>} />
                  <Route path="/legal" element={<PrivateRoute><LegalAIPage /></PrivateRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </LangContext.Provider>
  );
};

export default App;
