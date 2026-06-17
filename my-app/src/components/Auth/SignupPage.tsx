import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { Ic } from '../../utils/icons';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import LangModal from '../common/LangModal';

export default function SignupPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpOk, setOtpOk] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { signup, sendOtp, verifyOtp } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();

  const handleOtp = (i: number, v: string) => {
    if (!/^[0-9]?$/.test(v)) return;
    const n = [...otp];
    n[i] = v;
    setOtp(n);
    if (v && i < 5) (document.getElementById(`ob${i + 1}`) as HTMLInputElement)?.focus();
  };

  const doSend = async () => {
    if (form.phone.length < 10) {
      setErr('Enter a valid 10-digit mobile number');
      return;
    }
    setErr('');
    setSending(true);
    const r = await sendOtp(form.phone);
    setSending(false);
    if (r.ok) {
      setOtpSent(true);
      setInfo(r.msg);
    } else setErr(r.msg);
  };

  const doVerify = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setErr('Enter all 6 OTP digits');
      return;
    }
    if (verifyOtp(form.phone, entered)) {
      setOtpOk(true);
      setErr('');
      setInfo('Mobile verified ✓');
    } else setErr('Incorrect OTP. Try again.');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpOk) {
      setErr('Please verify your mobile number first.');
      return;
    }
    if (form.password !== form.confirm) {
      setErr('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = signup(form);
    setLoading(false);
    if (ok) {
      alert('Account created! Please login.');
      nav('/login');
    } else setErr('An account with this email or phone already exists.');
  };

  return (
    <div className="page">
      <Header />
      <div className="auth-wrap" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="auth-card wide">
          <div className="auth-head">
            <div className="auth-head-icon">
              <Ic.User />
            </div>
            <h2>Officer Registration</h2>
            <p>Create your CrimeGPT account</p>
          </div>
          <div className="auth-body">
            {err && (
              <div className="alert alert-error">
                <Ic.Alert />
                {err}
              </div>
            )}
            {info && !err && (
              <div className="alert alert-success">
                <Ic.Check />
                {info}
              </div>
            )}
            <form onSubmit={submit} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('firstName')}</label>
                  <input
                    className="form-input"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('lastName')}</label>
                  <input
                    className="form-input"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('phone')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="form-input-icon" style={{ flex: 1 }}>
                    <span className="fi-icon">
                      <Ic.Phone />
                    </span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="10-digit mobile"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      disabled={otpOk}
                      maxLength={10}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={doSend}
                    disabled={otpSent || sending || otpOk}
                    style={{ flexShrink: 0, minWidth: 96 }}
                  >
                    {sending ? (
                      <span className="spin" />
                    ) : otpOk ? (
                      <>
                        <Ic.Check />
                        Verified
                      </>
                    ) : otpSent ? (
                      'Resend'
                    ) : (
                      t('sendOtp')
                    )}
                  </button>
                </div>
              </div>
              {otpSent && !otpOk && (
                <div className="form-group">
                  <label className="form-label">Enter 6-digit OTP</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div className="otp-row">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          id={`ob${i}`}
                          className="otp-box"
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={d}
                          onChange={(e) => handleOtp(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[i] && i > 0)
                              (document.getElementById(`ob${i - 1}`) as HTMLInputElement)?.focus();
                          }}
                        />
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline btn-sm" onClick={doVerify}>
                      {t('verifyOtp')}
                    </button>
                  </div>
                </div>
              )}
              <hr className="divider" />
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('password')}</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spin" />
                    &nbsp;Creating Account&hellip;
                  </>
                ) : (
                  <>
                    {t('signup')} <Ic.ChevR />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="auth-footer">
            {t('haveAccount')} <button onClick={() => nav('/login')}>{t('login')}</button>
          </div>
        </div>
      </div>
      <Footer />
      <LangModal />
    </div>
  );
}
