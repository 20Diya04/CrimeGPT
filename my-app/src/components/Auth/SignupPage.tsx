import { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { Ic } from '../../utils/icons';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import LangModal from '../common/LangModal';
import axios from "axios";

export default function SignupPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpOk, setOtpOk] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { signup } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();


  const REACT_APP_API_URL = process.env.REACT_APP_API_URL
  // console.log("API URL:", REACT_APP_API_URL);


  const handleOtp = (i: number, v: string) => {
    if (!/^[0-9]?$/.test(v)) return;
    const n = [...otp];
    n[i] = v;
    setOtp(n);
    if (v && i < 5) (document.getElementById(`ob${i + 1}`) as HTMLInputElement)?.focus();
  };

  const doSend = async () => {
    try {
      setSending(true);

      const { data } = await axios.post(
        `${REACT_APP_API_URL}/User/send-otp`,
        {
          phone: form.phone,
        }
      );

      if (data.success) {
        setOtpSent(true);
        setInfo(data.message);
      }
    } catch (error: any) {
      setErr(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setSending(false);
    }
  };


  const doVerify = async () => {
    const enteredOtp = otp.join("");

    const response = await axios.post(
      `${REACT_APP_API_URL}/User/verify-otp`,
      {
        phone: form.phone,
        otp: enteredOtp
      }
    );

    const data = response.data;

    if (data.success) {
      setOtpOk(true);
      setInfo("Mobile verified");
    } else {
      setErr(data.message);
    }
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
    const response = await axios.post(
      `${REACT_APP_API_URL}/User/register`, form
    );

    if (response.data.success) {
      alert('Account created! Please login.');
      nav('/login');
    } else {
      setErr(response.data.message || 'Registration failed');
    }
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
