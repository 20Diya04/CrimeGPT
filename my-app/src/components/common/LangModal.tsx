import { useLang } from '../../contexts/LangContext';
import { Ic } from '../../utils/icons';

const opts = [
  { code: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
  { code: 'hi', flag: '🇮🇳', name: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', flag: '🇮🇳', name: 'Gujarati', native: 'ગુજરાતી' },
];

export default function LangModal() {
  const { lang, setLang, showLangModal, setShowLangModal } = useLang();
  if (!showLangModal) return null;

  return (
    <div className="overlay" onClick={() => setShowLangModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>
            <Ic.Globe /> Select Interface Language
          </h3>
          <button className="modal-x" onClick={() => setShowLangModal(false)}>
            <Ic.X />
          </button>
        </div>
        <div className="modal-body">
          {opts.map((o) => (
            <button
              key={o.code}
              className={`lang-opt ${lang === o.code ? 'sel' : ''}`}
              onClick={() => { setLang(o.code as any); setShowLangModal(false); }}
            >
              <span className="lang-flag">{o.flag}</span>
              <div>
                <div className="lang-name">{o.name}</div>
                <div className="lang-native">{o.native}</div>
              </div>
              {lang === o.code && (
                <span className="lang-chk">
                  <Ic.Check />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={() => setShowLangModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowLangModal(false)}>
            <Ic.Check /> Apply Language
          </button>
        </div>
      </div>
    </div>
  );
}
