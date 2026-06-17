import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { Ic } from '../../utils/icons';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import LangModal from '../common/LangModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const ok = login(email, pw);
    setLoading(false);
    ok ? nav('/dashboard') : setErr('Invalid credentials. Use demo@police.gov.in / 123456');
  };

  return (
    <div className="page">
      <Header />
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-head">
            <div className="auth-head-icon">
              <Ic.Shield />
            </div>
            <h2>Officer Login</h2>
            <p>Authorised Personnel Only</p>
          </div>
          <div className="auth-body">
            {err && (
              <div className="alert alert-error">
                <Ic.Alert />
                {err}
              </div>
            )}
            <form onSubmit={submit} autoComplete="off">
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <div className="form-input-icon">
                  <span className="fi-icon">
                    <Ic.Mail />
                  </span>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="officer@police.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('password')}</label>
                <div className="form-input-icon" style={{ position: 'relative' }}>
                  <span className="fi-icon">
                    <Ic.Lock />
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" className="form-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <Ic.EyeOff /> : <Ic.Eye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spin" />
                    &nbsp;Authenticating&hellip;
                  </>
                ) : (
                  <>
                    {t('login')} <Ic.ChevR />
                  </>
                )}
              </button>
            </form>
            <div
              className="auth-footer"
              style={{ marginTop: 16, fontSize: 12, color: 'var(--gray-400)' }}
            >
              Demo: demo@police.gov.in / 123456
            </div>
          </div>
          <div className="auth-footer">
            {t('noAccount')}{' '}
            <button onClick={() => nav('/signup')}>{t('signup')}</button>
          </div>
        </div>
      </div>
      <Footer />
      <LangModal />
    </div>
  );
}
