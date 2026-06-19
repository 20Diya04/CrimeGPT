import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LangContext';
import { Ic } from '../../utils/icons';
import { useEffect } from 'react';

interface HeaderProps {
  nav?: string;
  onNav?: (t: any) => void;
}

export default function Header({ nav: tab, onNav }: HeaderProps) {
  const { logout, user, login } = useAuth();
  const { lang, setShowLangModal, t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    login();
  }, []);

  const langLabel = lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ગુજરાતી';
  const navLabels: Record<string, string> = {
    dashboard: t('dashboard'),
    cases: t('cases'),
    documents: t('documents'),
    diary: t('diary'),
    legal: t('legal'),
  };
  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <>
      <div className="ashoka-strip" />
      <div className="top-strip">
        <span>Ministry of Home Affairs, Government of India</span>
        <div className="top-strip-right">
          <span>Screen Reader</span>
          <div className="top-strip-divider" />
          <span>Skip to Content</span>
          <div className="top-strip-divider" />
          <button
            className="hbtn"
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={() => setShowLangModal(true)}
          >
            <Ic.Globe /> {langLabel}
          </button>
        </div>
      </div>
      <div className="emblem-strip">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#003366,#004080)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#FFD700', fontSize: 18, fontWeight: 900 }}>⚖</span>
        </div>
        <div className="emblem-gov-text">
          <h3>भारत सरकार · Government of India</h3>
          <p>CrimeGPT — Legal Case Management System</p>
        </div>
        <div className="emblem-right">
          <span className="emblem-badge">Secure Portal</span>
          <span className="emblem-badge safe">NIC Certified</span>
        </div>
      </div>
      <div className="main-header">
        <div className="header-brand">
          <div className="header-logo">
            <Ic.Scale />
          </div>
          <div className="brand-text">
            <h1>CrimeGPT</h1>
            <div className="brand-sub">Police Intelligence Portal &nbsp;·&nbsp; Authorised Access Only</div>
          </div>
        </div>
        <div className="header-right">
          {user && (
            <div className="header-user-chip">
              <div className="header-user-avatar">{initials}</div>
              {user.firstName} {user.lastName}
            </div>
          )}
          {user && (
            <button
              className="hbtn danger"
              onClick={handleLogout}
            >
              <Ic.LogOut /> Logout
            </button>
          )}
        </div>
      </div>
      {onNav && (
        <div className="nav-bar">
          {(['dashboard', 'cases', 'documents', 'diary', 'legal'] as const).map((key) => (
            <button
              key={key}
              className={`nav-item ${tab === key ? 'active' : ''}`}
              onClick={() => onNav(key)}
            >
              {key === 'dashboard' && <Ic.Dash />}
              {key === 'cases' && <Ic.Folder />}
              {key === 'documents' && <Ic.FileOut />}
              {key === 'diary' && <Ic.Book />}
              {key === 'legal' && <Ic.Scale />}
              {navLabels[key]}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
