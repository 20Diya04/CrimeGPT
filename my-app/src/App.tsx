import React, { useState, createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// ─── INJECT GLOBAL CSS ────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rajdhani:wght@600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --navy:       #003366;
  --navy2:      #002244;
  --navy3:      #004080;
  --navy-light: #0a4f9e;
  --saffron:    #C45000;
  --saffron2:   #E86600;
  --green:      #1A7A4A;
  --green-bg:   #EAF7F0;
  --red:        #C0392B;
  --red-bg:     #FDEDEC;
  --amber-bg:   #FEF9E7;
  --amber:      #B7950B;
  --white:      #FFFFFF;
  --gray-50:    #F4F6FA;
  --gray-100:   #EEF1F8;
  --gray-200:   #DDE3ED;
  --gray-300:   #B8C4D6;
  --gray-400:   #7A8BA4;
  --gray-500:   #4A5568;
  --gray-700:   #2D3748;
  --gray-800:   #1A202C;
  --gray-900:   #0F1623;
  --font: 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Rajdhani', 'Inter', system-ui, sans-serif;
  --r-sm: 4px; --r-md: 8px; --r-lg: 14px;
  --sh-sm: 0 1px 4px rgba(0,0,0,.07);
  --sh-md: 0 4px 14px rgba(0,0,0,.10);
  --sh-lg: 0 8px 28px rgba(0,0,0,.14);
}

/* PREVENT BROWSER AUTOFILL DARKENING */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
  box-shadow: 0 0 0 1000px #ffffff inset !important;
  -webkit-text-fill-color: #1A202C !important;
  background-color: #ffffff !important;
  color: #1A202C !important;
}

body {
  font-family: var(--font);
  background: #EBF0FA;
  color: var(--gray-700);
  font-size: 14.5px;
  line-height: 1.55;
}

/* ── ASHOKA STRIP (top patriotic strip) ── */
.ashoka-strip {
  height: 5px;
  background: linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%);
}

/* ── TOP GOV STRIP ── */
.top-strip {
  background: linear-gradient(90deg, #061d3a 0%, #0a2d5e 100%);
  color: rgba(255,255,255,.70);
  font-size: 11.5px;
  padding: 7px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: .35px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.top-strip a { color: rgba(255,255,255,.60); text-decoration: none; margin: 0 8px; transition: color .15s; }
.top-strip a:hover { color: var(--saffron2); }
.top-strip-right { display: flex; align-items: center; gap: 8px; }
.top-strip-divider { width: 1px; height: 14px; background: rgba(255,255,255,.2); margin: 0 4px; }

/* ── EMBLEM STRIP ── */
.emblem-strip {
  background: #FFFFFF;
  padding: 8px 28px;
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 2px solid var(--gray-200);
  box-shadow: 0 2px 6px rgba(0,0,0,.05);
}
.emblem-gov-text { flex: 1; }
.emblem-gov-text h3 { font-size: 11px; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1px; }
.emblem-gov-text p { font-size: 18px; font-weight: 700; color: var(--navy2); letter-spacing: .3px; font-family: var(--font-heading); }
.emblem-right { display: flex; align-items: center; gap: 12px; }
.emblem-badge {
  background: var(--navy);
  color: white;
  padding: 5px 13px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .8px;
  text-transform: uppercase;
}
.emblem-badge.safe { background: var(--green); }

/* ── MAIN HEADER ── */
.main-header {
  background: linear-gradient(135deg, #052347 0%, #0b3a75 60%, #0e4a9a 100%);
  min-height: 80px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}
.main-header::before {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 300px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.04));
  pointer-events: none;
}
.main-header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--saffron), var(--saffron2), var(--saffron));
}
.header-brand { display: flex; align-items: center; gap: 16px; z-index: 1; }
.header-logo {
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(255,255,255,.12);
  border: 2px solid rgba(255,255,255,.25);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.header-logo svg { width: 24px; height: 24px; stroke: #FFD700; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.brand-text h1 {
  font-size: 24px; font-weight: 700; color: white;
  letter-spacing: .5px;
  font-family: var(--font-heading);
  line-height: 1.1;
}
.brand-text .brand-sub {
  font-size: 10.5px;
  color: rgba(255,255,255,.50);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-top: 3px;
}
.header-right { display: flex; align-items: center; gap: 10px; z-index: 1; }
.header-user-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 999px;
  padding: 5px 14px 5px 8px;
  color: rgba(255,255,255,.85);
  font-size: 12.5px;
}
.header-user-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--saffron);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: white;
}
.hbtn {
  display: inline-flex; align-items: center; gap: 5px;
  background: none; border: 1px solid rgba(255,255,255,.22); color: rgba(255,255,255,.82);
  padding: 7px 14px; border-radius: var(--r-sm); cursor: pointer; font-size: 12.5px;
  transition: all .18s; font-family: var(--font);
}
.hbtn:hover { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.45); }
.hbtn.danger { border-color: rgba(255,90,70,.35); color: #FF9988; }
.hbtn.danger:hover { background: rgba(255,60,40,.15); }
.hbtn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ── NAV BAR ── */
.nav-bar {
  background: linear-gradient(90deg, #043070 0%, #073d8a 100%);
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 3px solid var(--saffron);
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.nav-item {
  display: inline-flex; align-items: center; gap: 7px;
  background: none; border: none; color: rgba(255,255,255,.65);
  padding: 12px 18px; cursor: pointer; font-size: 13px; font-weight: 500;
  border-bottom: 3px solid transparent; margin-bottom: -3px;
  transition: all .18s; font-family: var(--font); letter-spacing: .2px;
  position: relative;
}
.nav-item:hover { color: white; background: rgba(255,255,255,.07); }
.nav-item.active { color: white; border-bottom-color: var(--saffron); background: rgba(255,255,255,.10); font-weight: 600; }
.nav-item svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ── PAGE ── */
.page { min-height: 100vh; display: flex; flex-direction: column; background: transparent; }
.content { flex: 1; padding: 30px 32px 44px; max-width: 1440px; margin: 0 auto; width: 100%; }

/* ── PAGE TITLE ── */
.page-title {
  font-size: 24px; font-weight: 700; color: var(--navy2); margin-bottom: 4px;
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-heading); letter-spacing: .3px;
}
.page-title svg { width: 22px; height: 22px; stroke: var(--navy); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.breadcrumb {
  font-size: 11.5px; color: var(--gray-400); margin-bottom: 26px;
  display: flex; align-items: center; gap: 5px;
}
.breadcrumb span { color: var(--saffron); font-weight: 500; }
.breadcrumb-sep { color: var(--gray-300); }

/* ── STATS ── */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 18px; margin-bottom: 24px; }
.stat-card {
  background: white; border-radius: var(--r-md); padding: 20px 22px;
  border-top: 4px solid var(--navy); box-shadow: var(--sh-sm);
  display: flex; align-items: center; gap: 16px;
  cursor: pointer; transition: all .2s;
  position: relative; overflow: hidden;
}
.stat-card::after {
  content: ''; position: absolute; top: 0; right: 0;
  width: 60px; height: 60px;
  background: radial-gradient(circle at top right, rgba(0,51,102,.04), transparent);
  pointer-events: none;
}
.stat-card:hover { box-shadow: var(--sh-md); transform: translateY(-1px); }
.stat-card.orange { border-top-color: var(--saffron); }
.stat-card.green  { border-top-color: var(--green); }
.stat-icon {
  width: 48px; height: 48px; border-radius: var(--r-md); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,51,102,.07);
}
.stat-card.orange .stat-icon { background: rgba(196,80,0,.09); }
.stat-card.green  .stat-icon { background: rgba(26,122,74,.09); }
.stat-icon svg { width: 22px; height: 22px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke: var(--navy); }
.stat-card.orange .stat-icon svg { stroke: var(--saffron); }
.stat-card.green  .stat-icon svg { stroke: var(--green); }
.stat-num  { font-size: 32px; font-weight: 700; color: var(--gray-800); line-height: 1; font-family: var(--font-heading); }
.stat-label{ font-size: 11px; color: var(--gray-400); text-transform: uppercase; letter-spacing: .6px; margin-top: 5px; }

.page-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 24px; }
.content-main { min-width: 0; }

/* ── CHAT PANEL ── */
.chat-panel {
  background: white; border: 1px solid var(--gray-200); border-radius: var(--r-lg); box-shadow: var(--sh-sm);
  display: flex; flex-direction: column; min-height: 560px; overflow: hidden;
  position: sticky; top: 20px;
}
.chat-header {
  background: linear-gradient(135deg, #052347, #0b3a75);
  padding: 18px 18px 14px;
  display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;
}
.chat-title { font-size: 16px; font-weight: 700; color: white; font-family: var(--font-heading); letter-spacing: .3px; }
.chat-subtitle { margin-top: 3px; font-size: 11.5px; color: rgba(255,255,255,.55); line-height: 1.4; }
.chat-badge {
  background: var(--saffron); color: white; padding: 5px 11px;
  border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: .8px;
  text-transform: uppercase;
}
.chat-body { flex: 1; padding: 16px 16px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: var(--gray-50); }
.chat-bubble { padding: 11px 14px; border-radius: var(--r-md); max-width: 100%; line-height: 1.55; font-size: 13px; }
.chat-bubble.assistant { background: white; color: var(--gray-800); align-self: flex-start; border: 1px solid var(--gray-200); box-shadow: var(--sh-sm); }
.chat-bubble.user { background: var(--navy); color: white; align-self: flex-end; }
.chat-footer { padding: 12px 16px 16px; border-top: 1px solid var(--gray-200); display: flex; flex-direction: column; gap: 8px; background: white; }
.chat-input {
  width: 100%; border: 1.5px solid var(--gray-200); border-radius: var(--r-sm);
  resize: vertical; padding: 10px 12px; font-family: var(--font); font-size: 13px;
  color: var(--gray-800) !important; background: white !important; outline: none;
  -webkit-text-fill-color: var(--gray-800) !important;
}
.chat-input:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(0,51,102,.10); }
.chat-input::placeholder { color: var(--gray-400); }

/* ── STATUS FILTERS ── */
.status-filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(105px, 1fr)); gap: 10px; margin-bottom: 22px; }
.status-chip {
  border: 1.5px solid var(--gray-200); background: white; border-radius: var(--r-md);
  padding: 12px 14px; display: flex; flex-direction: column; gap: 4px;
  cursor: pointer; transition: all .18s; font-size: 12px; color: var(--gray-600);
  position: relative; overflow: hidden;
}
.status-chip::before {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px; background: var(--navy); opacity: 0; transition: opacity .18s;
}
.status-chip:hover { border-color: var(--navy); box-shadow: var(--sh-sm); }
.status-chip.active { border-color: var(--navy); background: rgba(0,51,102,.05); }
.status-chip.active::before { opacity: 1; }
.status-chip strong { font-size: 20px; color: var(--navy); font-family: var(--font-heading); font-weight: 700; }
.status-chip span { font-size: 10.5px; text-transform: uppercase; letter-spacing: .5px; color: var(--gray-400); }

.filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
.filter-bar div { font-size: 13px; color: var(--gray-500); }

/* ── CARD ── */
.card {
  background: white; border-radius: var(--r-lg); box-shadow: var(--sh-sm);
  border: 1px solid var(--gray-200); overflow: hidden; margin-bottom: 22px;
}
.card-head {
  background: linear-gradient(90deg, #f8f9fc, #f4f6fa);
  border-bottom: 1px solid var(--gray-200);
  padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.card-title { font-size: 13.5px; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 7px; font-family: var(--font-heading); letter-spacing: .2px; }
.card-title svg { width: 15px; height: 15px; stroke: var(--navy); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.card-body { padding: 20px; }

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
thead th {
  background: linear-gradient(90deg, #052347, #0a3870);
  color: rgba(255,255,255,.90); padding: 12px 16px; text-align: left;
  font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: .7px; white-space: nowrap;
}
thead th:first-child { border-radius: 0; }
tbody td { padding: 12px 16px; border-bottom: 1px solid var(--gray-100); color: var(--gray-700); }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: rgba(0,51,102,.03); }
.case-no { color: var(--navy); font-weight: 700; letter-spacing: .2px; }

/* ── BADGES ── */
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .3px; }
.badge.active   { background: var(--green-bg);  color: var(--green); }
.badge.pending  { background: var(--amber-bg);  color: var(--amber); }
.badge.solved   { background: #EAF5FF; color: #1565C0; }
.badge.open     { background: #FFF3E0; color: #E65100; }
.badge.unsolved { background: var(--red-bg);    color: var(--red); }
.badge.closed   { background: var(--amber-bg);  color: var(--amber); }
.tag { font-size: 11.5px; background: rgba(0,51,102,.08); color: var(--navy); padding: 2px 8px; border-radius: 3px; font-family: monospace; font-weight: 600; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: var(--r-sm); font-size: 13px;
  font-weight: 600; cursor: pointer; border: none; transition: all .18s;
  letter-spacing: .2px; font-family: var(--font); white-space: nowrap;
}
.btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.btn-primary { background: var(--navy); color: white; }
.btn-primary:hover { background: var(--navy2); box-shadow: 0 4px 12px rgba(0,51,102,.3); }
.btn-accent { background: var(--saffron); color: white; }
.btn-accent:hover { background: var(--saffron2); }
.btn-outline { background: white; color: var(--navy); border: 1.5px solid var(--navy); }
.btn-outline:hover { background: var(--gray-50); }
.btn-ghost-red { background: none; color: var(--red); border: 1px solid rgba(192,57,43,.3); padding: 6px 12px; font-size: 12px; }
.btn-ghost-red:hover { background: var(--red-bg); }
.btn-sm { padding: 6px 13px; font-size: 12.5px; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-mic {
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  padding: 9px 16px; border-radius: var(--r-sm); font-size: 13px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--gray-200); transition: all .18s;
  font-family: var(--font); background: white; color: var(--gray-600);
}
.btn-mic:hover { border-color: var(--navy); color: var(--navy); }
.btn-mic.recording {
  background: var(--red-bg); border-color: var(--red); color: var(--red);
  animation: pulse-border 1.2s ease infinite;
}
@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(192,57,43,.3); }
  50% { box-shadow: 0 0 0 5px rgba(192,57,43,.1); }
}
.btn-mic svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ── TOOLBAR ── */
.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.search-box {
  display: flex; align-items: center; gap: 0;
  border: 1.5px solid var(--gray-200); border-radius: var(--r-sm);
  background: white; overflow: hidden; width: 320px;
}
.search-box:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(0,51,102,.08); }
.search-box svg { margin: 0 10px; color: var(--gray-300); flex-shrink: 0; width: 15px; height: 15px; stroke: var(--gray-300); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.search-box input {
  border: none; outline: none; padding: 9px 10px 9px 0; font-size: 13.5px; flex: 1;
  font-family: var(--font); color: var(--gray-800) !important; background: transparent !important;
  -webkit-text-fill-color: var(--gray-800) !important;
}

/* ── FORM ── */
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 11px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: .7px; margin-bottom: 6px; }
.form-input {
  width: 100%; border: 1.5px solid var(--gray-200); border-radius: var(--r-sm);
  padding: 11px 14px; font-size: 14px; font-family: var(--font);
  color: var(--gray-900) !important; background: white !important; outline: none; transition: border-color .18s, box-shadow .18s;
  -webkit-text-fill-color: var(--gray-900) !important;
}
.form-input::placeholder { color: var(--gray-300) !important; -webkit-text-fill-color: var(--gray-300) !important; }
.form-input:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(0,51,102,.10); }
.form-input-icon { position: relative; }
.form-input-icon .form-input { padding-left: 42px; }
.form-input-icon .fi-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.form-input-icon .fi-icon svg { width: 15px; height: 15px; stroke: var(--gray-300); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.form-row { display: flex; gap: 12px; }
.form-row .form-group { flex: 1; }
textarea.form-input { resize: vertical; min-height: 90px; color: var(--gray-900) !important; -webkit-text-fill-color: var(--gray-900) !important; }
.form-eye { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0; }
.form-eye svg { width: 15px; height: 15px; stroke: var(--gray-400); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ── ALERTS ── */
.alert { padding: 11px 15px; border-radius: var(--r-sm); font-size: 13px; display: flex; align-items: flex-start; gap: 9px; margin-bottom: 14px; }
.alert svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.alert-error   { background: var(--red-bg);   color: var(--red);   border: 1px solid rgba(192,57,43,.2); }
.alert-error svg { stroke: var(--red); }
.alert-success { background: var(--green-bg); color: var(--green); border: 1px solid rgba(26,122,74,.2); }
.alert-success svg { stroke: var(--green); }
.alert-info    { background: rgba(0,51,102,.05); color: var(--navy); border: 1px solid rgba(0,51,102,.15); }
.alert-info svg { stroke: var(--navy); }

/* ── OTP BOXES ── */
.otp-row { display: flex; gap: 8px; margin-top: 4px; }
.otp-box {
  width: 48px; height: 52px; text-align: center; font-size: 22px; font-weight: 700;
  border: 2px solid var(--gray-200); border-radius: var(--r-sm);
  outline: none; transition: border-color .18s; font-family: var(--font);
  background: white !important; color: var(--gray-900) !important;
  -webkit-text-fill-color: var(--gray-900) !important;
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
}
.otp-box:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(0,51,102,.10) !important; }

/* ── AUTH ── */
.auth-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 36px 16px; }
.auth-card { background: white; border-radius: var(--r-lg); box-shadow: var(--sh-lg); width: 100%; max-width: 440px; border: 1px solid var(--gray-200); overflow: hidden; }
.auth-card.wide { max-width: 520px; }
.auth-head { background: linear-gradient(135deg, #052347 0%, #0b3a75 100%); padding: 28px 32px; text-align: center; position: relative; }
.auth-head::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--saffron), var(--saffron2)); }
.auth-head-icon {
  width: 56px; height: 56px; background: rgba(255,255,255,.10);
  border: 2px solid rgba(255,255,255,.20);
  border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
}
.auth-head-icon svg { width: 28px; height: 28px; stroke: #FFD700; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.auth-head h2 { color: white; font-size: 21px; font-weight: 700; font-family: var(--font-heading); letter-spacing: .3px; }
.auth-head p  { color: rgba(255,255,255,.50); font-size: 11.5px; margin-top: 4px; }
.auth-body { padding: 28px 30px; }
.auth-footer { text-align: center; padding: 12px 30px 22px; font-size: 13px; color: var(--gray-400); }
.auth-footer button { background: none; border: none; color: var(--navy); font-weight: 600; cursor: pointer; font-family: var(--font); }
.auth-footer button:hover { text-decoration: underline; }
hr.divider { border: none; border-top: 1px solid var(--gray-100); margin: 18px 0; }

/* ── MODAL ── */
.overlay {
  position: fixed; inset: 0; background: rgba(0,15,40,.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(4px);
  animation: fadein .2s;
}
@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideup { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.modal {
  background: white; border-radius: var(--r-lg); box-shadow: var(--sh-lg);
  width: 100%; max-width: 560px; margin: 20px; overflow: hidden;
  animation: slideup .22s; max-height: 88vh; overflow-y: auto;
}
.modal-head {
  background: linear-gradient(135deg, #052347, #0a3870);
  padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;
  border-bottom: 3px solid var(--saffron);
}
.modal-head h3 { color: white; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 9px; font-family: var(--font-heading); }
.modal-head h3 svg { width: 17px; height: 17px; stroke: white; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.modal-x { background: none; border: none; color: rgba(255,255,255,.6); cursor: pointer; padding: 3px; border-radius: 4px; line-height: 0; }
.modal-x:hover { color: white; background: rgba(255,255,255,.1); }
.modal-x svg { width: 17px; height: 17px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.modal-body { padding: 24px; }
.modal-foot { padding: 14px 24px; background: var(--gray-50); border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 9px; }

/* ── LANG OPTIONS ── */
.lang-opt {
  display: flex; align-items: center; gap: 13px;
  width: 100%; padding: 14px 18px; background: var(--gray-50);
  border: 2px solid var(--gray-200); border-radius: var(--r-md);
  cursor: pointer; transition: all .18s; margin-bottom: 9px; text-align: left;
}
.lang-opt:last-child { margin-bottom: 0; }
.lang-opt:hover { border-color: var(--navy); background: rgba(0,51,102,.04); }
.lang-opt.sel { border-color: var(--navy); background: rgba(0,51,102,.05); }
.lang-flag { font-size: 22px; }
.lang-name { font-weight: 600; color: var(--gray-800); font-size: 14.5px; }
.lang-native { font-size: 12.5px; color: var(--gray-400); margin-top: 1px; }
.lang-chk { margin-left: auto; }
.lang-chk svg { width: 17px; height: 17px; stroke: var(--navy); fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

/* ── SPINNER ── */
.spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: rotate .7s linear infinite; display: inline-block; }
@keyframes rotate { to { transform: rotate(360deg); } }

/* ── DOC ── */
.doc-pre {
  background: white; border: 1px solid var(--gray-200);
  border-left: 4px solid var(--navy); border-radius: var(--r-md);
  padding: 24px; font-family: 'Courier New', monospace; font-size: 13px;
  white-space: pre-wrap; line-height: 1.9; box-shadow: var(--sh-sm);
  margin-bottom: 14px; color: var(--gray-800);
}

/* ── EMPTY ── */
.empty { text-align: center; padding: 60px 20px; color: var(--gray-400); }
.empty svg { width: 48px; height: 48px; stroke: var(--gray-200); fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; margin: 0 auto 14px; display: block; }
.empty h3 { font-size: 15.5px; font-weight: 600; color: var(--gray-500); margin-bottom: 5px; }
.empty p { font-size: 13px; }

/* ── DIARY ENTRY ── */
.diary-entry {
  padding: 14px 0; border-bottom: 1px solid var(--gray-100);
  position: relative;
}
.diary-entry:last-child { border-bottom: none; }
.diary-entry-title { font-weight: 700; color: var(--navy2); font-size: 13.5px; margin-bottom: 4px; }
.diary-entry-date { font-size: 11px; color: var(--gray-400); margin-bottom: 6px; font-style: italic; }
.diary-entry-note { font-size: 13px; color: var(--gray-700); line-height: 1.6; }

/* ── MIC STATUS ── */
.mic-status { font-size: 11.5px; color: var(--gray-400); display: flex; align-items: center; gap: 5px; }
.mic-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); animation: blink 1s ease infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }

/* ── SUGGESTION CHIPS ── */
.suggestion-btn {
  display: flex; align-items: center; gap: 12px;
  width: 100%; padding: 14px 18px; background: white;
  border: 1.5px solid var(--gray-200); border-radius: var(--r-md);
  cursor: pointer; transition: all .18s; text-align: left;
  font-family: var(--font);
}
.suggestion-btn:hover { border-color: var(--navy); background: rgba(0,51,102,.03); box-shadow: var(--sh-sm); }
.suggestion-btn-icon {
  width: 36px; height: 36px; border-radius: 8px; background: rgba(0,51,102,.07);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.suggestion-btn-icon svg { width: 16px; height: 16px; stroke: var(--navy); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.suggestion-btn-title { font-size: 13px; font-weight: 600; color: var(--navy2); }
.suggestion-btn-sub { font-size: 11.5px; color: var(--gray-400); margin-top: 1px; }

/* ── AUDIT LOG ── */
.audit-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--gray-100); gap: 10px; }
.audit-row:last-child { border-bottom: none; }
.audit-msg { font-size: 13px; color: var(--gray-700); }
.audit-time { font-size: 11.5px; color: var(--gray-400); white-space: nowrap; background: var(--gray-100); padding: 2px 8px; border-radius: 12px; }

/* ── FOOTER ── */
.footer-strip { height: 5px; background: linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%); }
.site-footer {
  background: linear-gradient(90deg, #061d3a 0%, #0a2d5e 100%);
  color: rgba(255,255,255,.40); text-align: center; padding: 16px 28px;
  font-size: 11.5px; letter-spacing: .3px;
}
.site-footer a { color: rgba(255,255,255,.4); text-decoration: none; }
.site-footer-links { display: flex; justify-content: center; gap: 16px; margin-bottom: 8px; font-size: 11px; }
.site-footer-links a:hover { color: var(--saffron2); }

/* Language dropdown styles */
.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--r-sm);
  box-shadow: var(--sh-md);
  z-index: 1000;
  min-width: 220px;
  max-height: 350px;
  overflow-y: auto;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.language-option:hover {
  background: rgba(0, 51, 102, 0.05);
}

.language-option.active {
  background: rgba(0, 51, 102, 0.08);
}

.language-flag {
  font-size: 20px;
}

.language-name {
  font-weight: 500;
  font-size: 13px;
}

.language-native {
  font-size: 10px;
  color: var(--gray-400);
  margin-top: 1px;
}

.language-check {
  margin-left: auto;
  color: var(--green);
}
`;

function InjectStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
  return null;
}

// ─── SVG ICON HELPERS ────────────────────────────────────────────────
const Ic = {
  Scale: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M12 3v18M3 9l4-4M21 9l-4-4M3 9h6M15 9h6M6.5 9l-2 6a4 4 0 0 0 7.8 0l-2-6M13.5 9l-2 6a4 4 0 0 0 7.8 0l-2-6"/></svg>,
  Globe: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.39 2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  LogOut: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Dash: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  Folder: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  File: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  X: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevR: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Alert: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  User: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  FileOut: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Brain: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M12 4a4 4 0 0 1 3.5 6A4 4 0 0 1 12 18a4 4 0 0 1-3.5-6A4 4 0 0 1 12 4z"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  Mic: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  MicOff: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 10v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Fingerprint: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 10v4M12 2v4M12 18v4M21 12h-4M7 12H3"/></svg>,
};

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const TR: any = {
  login:       { en: 'Login',              hi: 'लॉगिन',          gu: 'લોગિન'       },
  signup:      { en: 'Sign Up',            hi: 'साइन अप',        gu: 'સાઇન અપ'    },
  logout:      { en: 'Logout',             hi: 'लॉगआउट',        gu: 'લોગઆઉટ'     },
  email:       { en: 'Email Address',      hi: 'ईमेल पता',       gu: 'ઇ-મેઇલ'     },
  password:    { en: 'Password',           hi: 'पासवर्ड',        gu: 'પાસવર્ડ'    },
  phone:       { en: 'Mobile Number',      hi: 'मोबाइल नंबर',    gu: 'મોબાઇલ નંબર'},
  firstName:   { en: 'First Name',         hi: 'पहला नाम',       gu: 'પ્રથમ નામ'  },
  lastName:    { en: 'Last Name',          hi: 'अंतिम नाम',      gu: 'છેલ્લું નામ'},
  sendOtp:     { en: 'Send OTP',           hi: 'OTP भेजें',      gu: 'OTP મોકલો'  },
  verifyOtp:   { en: 'Verify',             hi: 'सत्यापित करें',   gu: 'ચકાસો'     },
  noAccount:   { en: "Don't have an account?", hi: 'खाता नहीं है?', gu: 'ખાતું નથી?' },
  haveAccount: { en: 'Already have an account?', hi: 'पहले से खाता है?', gu: 'પહેલેથી ખાતું?' },
  dashboard:   { en: 'Dashboard',          hi: 'डैशबोर्ड',       gu: 'ડેશબોર્ડ'   },
  cases:       { en: 'Cases',              hi: 'मामले',          gu: 'કેસો'        },
  documents:   { en: 'Documents',          hi: 'दस्तावेज़',       gu: 'દસ્તાવેજો'  },
  diary:       { en: 'Diary',              hi: 'डायरी',          gu: 'ડાયરી'       },
  legal:       { en: 'Legal Intelligence', hi: 'कानूनी बुद्धिमत्ता', gu: 'કાનૂની બુદ્ધિ' },
  newCase:     { en: 'New Case',           hi: 'नया मामला',      gu: 'નવો કેસ'    },
  accusedName: { en: 'Accused Name',       hi: 'आरोपी का नाम',   gu: 'આરોપીનું નામ'},
  sections:    { en: 'Sections (BNS/IPC)', hi: 'धाराएं',         gu: 'કલમો'       },
  itemsSeized: { en: 'Items / Evidence Seized', hi: 'जब्त सामान', gu: 'જપ્ત વસ્તુઓ'},
  statement:   { en: 'FIR / Case Summary', hi: 'FIR सारांश',    gu: 'FIR સારાંશ'},
  createCase:  { en: 'Register Case',      hi: 'मामला दर्ज',     gu: 'કેસ નોંધો'  },
  generateDoc: { en: 'Generate Document',  hi: 'दस्तावेज़ बनाएं', gu: 'દસ્તાવેજ'   },
  caseDetails: { en: 'Case Details',       hi: 'मामला विवरण',    gu: 'કેસ વિગતો'  },
  legalGuide:  { en: 'Recommended Legal Actions', hi: 'अनुशंसित कार्रवाई', gu: 'શિફારસ કાર્યવાહી' },
  auditLog:    { en: 'Audit Log',          hi: 'ऑडिट रिकॉर्ड',   gu: 'ઓડિટ લોગ'  },
  autoDiary:   { en: 'Auto-suggested Actions', hi: 'स्वचालित सुझाव', gu: 'સ્વચાલિત સૂચના' },
  recentUpdates:{ en: 'Recent Updates',    hi: 'हाल की गतिविधियाँ', gu: 'તાજા અપડેટ'},
  selectLang:  { en: 'Select Language',    hi: 'भाषा चुनें',     gu: 'ભાષા'        },
};

// ─── CONTEXTS ─────────────────────────────────────────────────────────────────
const LangCtx = createContext<any>(null);
const useLang = () => useContext(LangCtx);
function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'en'|'hi'|'gu'>('en');
  const [showLangModal, setShowLangModal] = useState(true);
  const t = (k: string) => TR[k]?.[lang] || TR[k]?.en || k;
  return <LangCtx.Provider value={{ lang, setLang, showLangModal, setShowLangModal, t }}>{children}</LangCtx.Provider>;
}

let DB: any[] = [];
const AuthCtx = createContext<any>(null);
const useAuth = () => useContext(AuthCtx);
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [pending, setPending] = useState<{phone:string;otp:string}|null>(null);
  const FAST2SMS_KEY = 'YOUR_FAST2SMS_API_KEY_HERE';

  const sendOtp = async (phone: string): Promise<{ok:boolean; msg:string}> => {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setPending({ phone, otp });
    if (FAST2SMS_KEY !== 'YOUR_FAST2SMS_API_KEY_HERE') {
      try {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_KEY}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.return === true) return { ok: true, msg: `OTP sent to +91 ${phone}` };
      } catch (_) {}
    }
    alert(`[DEV] OTP for ${phone}: ${otp}\n\nReplace FAST2SMS_KEY in App.tsx to send real SMS.`);
    return { ok: true, msg: `OTP dispatched to ${phone}` };
  };

  const verifyOtp = (phone: string, otp: string) => {
    if (pending?.phone === phone && pending?.otp === otp) { setPending(null); return true; }
    return false;
  };
  const signup = (data: any) => {
    if (DB.find(u => u.email === data.email || u.phone === data.phone)) return false;
    DB.push({ id: Date.now(), ...data }); return true;
  };
  const login = (email: string, pw: string) => {
    const u = DB.find(u => u.email === email && u.password === pw);
    if (u) { setUser(u); setIsAuth(true); return true; }
    return false;
  };
  const logout = () => { setUser(null); setIsAuth(false); };
  
  // Add demo user
  React.useEffect(() => {
    if (DB.length === 0) {
      DB.push({ id: 1, firstName: 'Demo', lastName: 'Officer', email: 'demo@police.gov.in', password: '123456', phone: '9876543210' });
    }
  }, []);
  
  return <AuthCtx.Provider value={{ user, isAuth, login, signup, logout, sendOtp, verifyOtp }}>{children}</AuthCtx.Provider>;
}

// ─── LANGUAGE MODAL ───────────────────────────────────────────────────────────
function LangModal() {
  const { lang, setLang, showLangModal, setShowLangModal } = useLang();
  const [sel, setSel] = useState(lang);
  if (!showLangModal) return null;
  const opts = [
    { code: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
    { code: 'hi', flag: '🇮🇳', name: 'Hindi', native: 'हिन्दी' },
    { code: 'gu', flag: '🇮🇳', name: 'Gujarati', native: 'ગુજરાતી' },
  ];
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <h3><Ic.Globe /> Select Interface Language</h3>
          <button className="modal-x" onClick={() => setShowLangModal(false)}><Ic.X /></button>
        </div>
        <div className="modal-body">
          {opts.map(o => (
            <button key={o.code} className={`lang-opt ${sel === o.code ? 'sel' : ''}`} onClick={() => setSel(o.code as any)}>
              <span className="lang-flag">{o.flag}</span>
              <div><div className="lang-name">{o.name}</div><div className="lang-native">{o.native}</div></div>
              {sel === o.code && <span className="lang-chk"><Ic.Check /></span>}
            </button>
          ))}
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={() => setShowLangModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setLang(sel as any); setShowLangModal(false); }}>
            <Ic.Check /> Apply Language
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <>
      <div className="site-footer">
        <div className="site-footer-links">
          <span>Home</span>
          <span>Disclaimer</span>
          <span>Privacy Policy</span>
          <span>Contact Us</span>
          <span>Accessibility</span>
          <span>Sitemap</span>
        </div>
        © {new Date().getFullYear()} CrimeGPT — Ministry of Home Affairs, Government of India &nbsp;|&nbsp; All Rights Reserved &nbsp;|&nbsp; v2.0 &nbsp;|&nbsp; NIC Hosted
      </div>
      <div className="footer-strip" />
    </>
  );
}

// ─── CHAT SIDEBAR ─────────────────────────────────────────────────────────────
function ChatSidebar({ messages, draft, onDraft, onSend, loading }: any) {
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
          onChange={e => onDraft(e.target.value)}
          placeholder="Ask CrimeGPT about cases, reports, or legal guidance…"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        />
        <button className="btn btn-primary btn-sm" onClick={onSend} disabled={loading || !draft.trim()}>
          {loading ? <><span className="spin" />&nbsp;Thinking…</> : 'Send Message'}
        </button>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ nav: tab, onNav }: { nav?: string; onNav?: (t: any) => void }) {
  const { logout, user } = useAuth();
  const { lang, setShowLangModal, t } = useLang();
  const navigate = useNavigate();
  const langLabel = lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ગુજરાતી';
  const navLabels: Record<string,string> = {
    dashboard: t('dashboard'), cases: t('cases'),
    documents: t('documents'), diary: t('diary'), legal: t('legal'),
  };
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '';
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
          <button className="hbtn" style={{fontSize:11, padding:'4px 10px'}} onClick={() => setShowLangModal(true)}>
            <Ic.Globe /> {langLabel}
          </button>
        </div>
      </div>
      <div className="emblem-strip">
        <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#003366,#004080)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <span style={{color:'#FFD700',fontSize:18,fontWeight:900}}>⚖</span>
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
          <div className="header-logo"><Ic.Scale /></div>
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
            <button className="hbtn danger" onClick={() => { logout(); navigate('/login'); }}>
              <Ic.LogOut /> Logout
            </button>
          )}
        </div>
      </div>
      {onNav && (
        <div className="nav-bar">
          {(['dashboard','cases','documents','diary','legal'] as const).map(key => (
            <button key={key} className={`nav-item ${tab===key ? 'active' : ''}`} onClick={() => onNav(key)}>
              {key==='dashboard' && <Ic.Dash />}
              {key==='cases'     && <Ic.Folder />}
              {key==='documents' && <Ic.FileOut />}
              {key==='diary'     && <Ic.Book />}
              {key==='legal'     && <Ic.Scale />}
              {navLabels[key]}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── SPEECH-TO-TEXT HOOK WITH MULTI-LANGUAGE SUPPORT ─────────────────────────
function useSpeechRecognition(onResult: (text: string, isFinal: boolean) => void) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('gu-IN');
  const recognitionRef = useRef<any>(null);

  const languageOptions = [
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
    { code: 'en-IN', name: 'English', flag: '🇬🇧', nativeName: 'English' },
    { code: 'gu-IN', name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
    { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
    { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
    { code: 'te-IN', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
    { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
    { code: 'kn-IN', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml-IN', name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
    { code: 'pa-IN', name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setError(null);
    if (recording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.lang = langCode;
            recognitionRef.current.start();
          }
        }, 100);
      } catch (err) {}
    } else if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLanguage;
      
      recognition.onstart = () => {
        setRecording(true);
        setError(null);
      };
      
      recognition.onend = () => {
        setRecording(false);
      };
      
      recognition.onresult = (event: any) => {
        let finalText = '';
        let interimText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalText += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }
        
        if (interimText) {
          onResult(interimText, false);
        }
        if (finalText) {
          onResult(finalText, true);
        }
      };
      
      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try speaking again.');
        } else {
          setError(`Error: ${event.error}`);
        }
        setRecording(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setSupported(false);
      setError('Speech recognition not supported in this browser.');
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [currentLanguage, onResult]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    
    if (recording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    } else {
      try {
        setError(null);
        recognitionRef.current.lang = currentLanguage;
        recognitionRef.current.start();
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone permissions.');
        } else {
          setError('Could not start speech recognition. Please try again.');
        }
      }
    }
  };

  return { recording, supported, error, toggle, currentLanguage, changeLanguage, languageOptions };
}

// ─── BADGE COMPONENT ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cls = status === 'Active' ? 'active' : status === 'Closed' ? 'closed' : status === 'Solved' ? 'solved' : status === 'Open' ? 'open' : 'unsolved';
  return <span className={`badge ${cls}`}>{status}</span>;
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = login(email, pw); setLoading(false);
    ok ? nav('/dashboard') : setErr('Invalid credentials. Use demo@police.gov.in / 123456');
  };

  return (
    <div className="page">
      <Header />
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-head">
            <div className="auth-head-icon"><Ic.Shield /></div>
            <h2>Officer Login</h2>
            <p>Authorised Personnel Only</p>
          </div>
          <div className="auth-body">
            {err && <div className="alert alert-error"><Ic.Alert />{err}</div>}
            <form onSubmit={submit} autoComplete="off">
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <div className="form-input-icon">
                  <span className="fi-icon"><Ic.Mail /></span>
                  <input type="email" className="form-input" placeholder="officer@police.gov.in" value={email} onChange={e=>setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('password')}</label>
                <div className="form-input-icon" style={{position:'relative'}}>
                  <span className="fi-icon"><Ic.Lock /></span>
                  <input type={showPw?'text':'password'} className="form-input" placeholder="Enter password" value={pw} onChange={e=>setPw(e.target.value)} required style={{paddingRight:40}} />
                  <button type="button" className="form-eye" onClick={()=>setShowPw(!showPw)}>
                    {showPw ? <Ic.EyeOff /> : <Ic.Eye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8,padding:'12px'}} disabled={loading}>
                {loading ? <><span className="spin"/>&nbsp;Authenticating…</> : <>{t('login')} <Ic.ChevR /></>}
              </button>
            </form>
            <div className="auth-footer" style={{marginTop:16, fontSize:12, color:'var(--gray-400)'}}>
              Demo: demo@police.gov.in / 123456
            </div>
          </div>
          <div className="auth-footer">{t('noAccount')} <button onClick={()=>nav('/signup')}>{t('signup')}</button></div>
        </div>
      </div>
      <Footer />
      <LangModal />
    </div>
  );
}

// ─── SIGNUP PAGE ──────────────────────────────────────────────────────────────
function SignupPage() {
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',phone:'',password:'',confirm:''});
  const [otp, setOtp] = useState(['','','','','','']);
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
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) (document.getElementById(`ob${i+1}`) as HTMLInputElement)?.focus();
  };

  const doSend = async () => {
    if (form.phone.length < 10) { setErr('Enter a valid 10-digit mobile number'); return; }
    setErr(''); setSending(true);
    const r = await sendOtp(form.phone); setSending(false);
    if (r.ok) { setOtpSent(true); setInfo(r.msg); } else setErr(r.msg);
  };

  const doVerify = () => {
    const entered = otp.join('');
    if (entered.length < 6) { setErr('Enter all 6 OTP digits'); return; }
    if (verifyOtp(form.phone, entered)) { setOtpOk(true); setErr(''); setInfo('Mobile verified ✓'); }
    else setErr('Incorrect OTP. Try again.');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpOk) { setErr('Please verify your mobile number first.'); return; }
    if (form.password !== form.confirm) { setErr('Passwords do not match.'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setLoading(true); await new Promise(r=>setTimeout(r,400));
    const ok = signup(form); setLoading(false);
    if (ok) { alert('Account created! Please login.'); nav('/login'); }
    else setErr('An account with this email or phone already exists.');
  };

  return (
    <div className="page">
      <Header />
      <div className="auth-wrap" style={{paddingTop:24,paddingBottom:24}}>
        <div className="auth-card wide">
          <div className="auth-head">
            <div className="auth-head-icon"><Ic.User /></div>
            <h2>Officer Registration</h2>
            <p>Create your CrimeGPT account</p>
          </div>
          <div className="auth-body">
            {err  && <div className="alert alert-error"><Ic.Alert />{err}</div>}
            {info && !err && <div className="alert alert-success"><Ic.Check />{info}</div>}
            <form onSubmit={submit} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('firstName')}</label>
                  <input className="form-input" placeholder="First name" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('lastName')}</label>
                  <input className="form-input" placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('email')}</label>
                <div className="form-input-icon">
                  <span className="fi-icon"><Ic.Mail /></span>
                  <input type="email" className="form-input" placeholder="officer@police.gov.in" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('phone')}</label>
                <div style={{display:'flex',gap:8}}>
                  <div className="form-input-icon" style={{flex:1}}>
                    <span className="fi-icon"><Ic.Phone /></span>
                    <input type="tel" className="form-input" placeholder="10-digit mobile" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} disabled={otpOk} maxLength={10} required />
                  </div>
                  <button type="button" className="btn btn-accent btn-sm" onClick={doSend} disabled={otpSent||sending||otpOk} style={{flexShrink:0,minWidth:96}}>
                    {sending ? <span className="spin"/> : otpOk ? <><Ic.Check />Verified</> : otpSent ? 'Resend' : t('sendOtp')}
                  </button>
                </div>
              </div>
              {otpSent && !otpOk && (
                <div className="form-group">
                  <label className="form-label">Enter 6-digit OTP</label>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <div className="otp-row">
                      {otp.map((d,i)=>(
                        <input
                          key={i} id={`ob${i}`} className="otp-box"
                          type="text" inputMode="numeric" maxLength={1} value={d}
                          onChange={e=>handleOtp(i,e.target.value)}
                          onKeyDown={e=>{ if(e.key==='Backspace'&&!otp[i]&&i>0) (document.getElementById(`ob${i-1}`) as HTMLInputElement)?.focus(); }}
                        />
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline btn-sm" onClick={doVerify}>{t('verifyOtp')}</button>
                  </div>
                </div>
              )}
              <hr className="divider" />
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('password')}</label>
                  <input type="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-input" placeholder="Repeat password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'12px'}} disabled={loading}>
                {loading ? <><span className="spin"/>&nbsp;Creating Account…</> : <>{t('signup')} <Ic.ChevR /></>}
              </button>
            </form>
          </div>
          <div className="auth-footer">{t('haveAccount')} <button onClick={()=>nav('/login')}>{t('login')}</button></div>
        </div>
      </div>
      <Footer />
      <LangModal />
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<'dashboard'|'cases'|'documents'|'diary'|'legal'>('dashboard');
  const [cases, setCases] = useState([
    { id:'1', number:'CASE/2024/001', name:'Vikram Singh',   sections:'BNS 303', items:'Mobile Phone',       statement:'Theft at railway station',         status:'Active'   },
    { id:'2', number:'CASE/2024/002', name:'Suresh Gupta',   sections:'BNS 61',  items:'Laptop, Hard Drive', statement:'Burglary at residential premises', status:'Closed'   },
    { id:'3', number:'CASE/2024/003', name:'Ravi Kumar',     sections:'BNS 115', items:'Cash ₹50,000',       statement:'Robbery at market area',           status:'Solved'   },
    { id:'4', number:'CASE/2024/004', name:'Anjali Mehta',   sections:'BNS 420', items:'Fake documents',     statement:'Fraud at government office',       status:'Unsolved' },
    { id:'5', number:'CASE/2024/005', name:'Rahul Sharma',   sections:'BNS 379', items:'Stolen vehicle',     statement:'Attempted robbery and abduction',  status:'Open'     },
  ]);
  const [docs, setDocs] = useState<any[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<any[]>([
    { id:'d1', caseId:'1', caseNum:'CASE/2024/001', title:'Case registered', note:'Initial FIR recorded and evidence logged.', date:'12 Jun 2024 09:10' },
    { id:'d2', caseId:'2', caseNum:'CASE/2024/002', title:'Evidence logged', note:'Laptop and hard drive entered into forensic review.', date:'12 Jun 2024 09:40' },
  ]);
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id:'a1', time:'09:12', message:'Officer signed in', caseId:'' },
    { id:'a2', time:'09:45', message:'Case CASE/2024/002 registered', caseId:'2' },
  ]);

  const [search, setSearch] = useState('');
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [docPreview, setDocPreview] = useState<any>(null);
  const [docType, setDocType] = useState('chargesheet');
  const [selCase, setSelCase] = useState('1');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [nc, setNc] = useState({name:'',sections:'',items:'',statement:''});
  const [ncErr, setNcErr] = useState('');
  const [newDiaryNote, setNewDiaryNote] = useState('');
  const [chatDraft, setChatDraft] = useState('');
  const [chatMessages, setChatMessages] = useState<{from:'user'|'assistant';text:string}[]>([
    { from:'assistant', text:'Hello Officer, I am CrimeGPT. Ask me about active cases, closed investigations, or legal suggestions.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [speechBuffer, setSpeechBuffer] = useState('');
  const [showLangSelector, setShowLangSelector] = useState(false);

  // Speech recognition for Diary with multi-language support
  const { 
    recording, 
    supported: micSupported, 
    error: micError, 
    toggle: toggleMic,
    currentLanguage,
    changeLanguage,
    languageOptions
  } = useSpeechRecognition((text: string, isFinal: boolean) => {
    if (isFinal) {
      setNewDiaryNote(prev => {
        const newText = prev + (prev ? ' ' : '') + text;
        return newText.length > 5000 ? newText : newText;
      });
      setSpeechBuffer('');
    } else {
      setSpeechBuffer(text);
    }
  });

  const getCurrentLangDisplay = () => {
    const lang = languageOptions.find(l => l.code === currentLanguage);
    return lang ? `${lang.flag} ${lang.name}` : '🎤 Select Language';
  };

  useEffect(() => {
    if (cases.length && !cases.some(c => c.id === selCase)) setSelCase(cases[0].id);
  }, [cases, selCase]);

  const selectedCase = cases.find(c => c.id === selCase) || cases[0];
  const diaryForCase = selectedCase ? diaryEntries.filter(e => e.caseId === selectedCase.id) : [];
  const statusCounts: Record<string,number> = {
    All: cases.length,
    Active: cases.filter(c => c.status==='Active').length,
    Closed: cases.filter(c => c.status==='Closed').length,
    Open: cases.filter(c => c.status==='Open').length,
    Solved: cases.filter(c => c.status==='Solved').length,
    Unsolved: cases.filter(c => c.status==='Unsolved').length,
  };

  const filtered = cases.filter(c =>
    (statusFilter==='All' || c.status===statusFilter) &&
    (c.number.toLowerCase().includes(search.toLowerCase()) ||
     c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.sections.toLowerCase().includes(search.toLowerCase()))
  );

  const logAudit = (message: string, caseId: string = '') => {
    const time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    setAuditLogs(prev => [{ id: Date.now().toString(), time, message, caseId }, ...prev].slice(0, 40));
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
      title, note: note.trim(),
      date: new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
    };
    setDiaryEntries(prev => [entry, ...prev]);
    logAudit(`Diary update for ${selectedCase.number}: ${title}`, selectedCase.id);
    setNewDiaryNote('');
  };

  const delCase = (id: string) => {
    if (!window.confirm('Delete this case? This cannot be undone.')) return;
    const removed = cases.find(c => c.id === id);
    setCases(prev => prev.filter(c => c.id !== id));
    setDiaryEntries(prev => prev.filter(e => e.caseId !== id));
    logAudit(`Case ${removed?.number || id} deleted`, id);
  };

  const addCase = () => {
    if (!nc.name || !nc.sections) { setNcErr('Accused Name and Sections are required.'); return; }
    const num = `CASE/2024/${String(cases.length+1).padStart(3,'0')}`;
    const created = { id: Date.now().toString(), number: num, ...nc, status:'Active' };
    setCases(prev => [...prev, created]);
    setShowCaseModal(false);
    setNc({name:'',sections:'',items:'',statement:''});
    setNcErr('');
    logAudit(`Case ${num} registered`, created.id);
  };

  const getLegalIntelligence = (c: any) => {
    if (!c) return [];
    const lines: string[] = [];
    const sections = c.sections.split(/[,;]+/).map((s:string) => s.trim()).filter(Boolean);
    sections.forEach((section: string) => {
      const id = section.toUpperCase();
      if (id.includes('303')) lines.push('BNS 303 — Theft: Recommend forensic digital evidence review and witness statements.');
      else if (id.includes('61'))  lines.push('BNS 61 — Criminal breach of trust: Check property transfer records and custody chain.');
      else if (id.includes('115')) lines.push('BNS 115 — Murder: Priority should be evidence preservation and forensic support.');
      else if (id.includes('420')) lines.push('BNS 420 — Fraud: Secure all documentary evidence and initiate financial investigation.');
      else if (id.includes('379')) lines.push('BNS 379 — Robbery: Review CCTV footage and arrange suspect identification parade.');
      else lines.push(`${section}: Review relevant precedent and confirm prima facie evidence.`);
    });
    if (c.status==='Closed'||c.status==='Solved') {
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
    if (lower.includes('legal')||lower.includes('intelligence')) return selectedCase ? `Legal guidance for ${selectedCase.number}: ${getLegalIntelligence(selectedCase).join(' ')}` : 'Select a case to get specific legal intelligence.';
    if (lower.includes('case')&&selectedCase) return `${selectedCase.number} — Status: ${selectedCase.status}. Accused: ${selectedCase.name}. Sections: ${selectedCase.sections}.`;
    if (lower.includes('help')) return 'Ask about active, closed, open, solved, or unsolved cases. I can also give legal intelligence on any selected case.';
    return 'I am ready to support you. Try asking about case status, legal intelligence, or evidence next steps.';
  };

  const handleAiSend = () => {
    const text = chatDraft.trim();
    if (!text) return;
    setChatMessages(prev => [...prev, { from:'user', text }]);
    setChatDraft('');
    setChatLoading(true);
    window.setTimeout(() => {
      setChatMessages(prev => [...prev, { from:'assistant', text: generateChatReply(text) }]);
      setChatLoading(false);
    }, 700);
  };

  const genDoc = () => {
    if (!selectedCase) return;
    const c = selectedCase;
    const date = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
    let body = '';
    if (docType==='chargesheet') body =
`GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS
PURVANI CHARGESHEET / पूर्वानी आरोप पत्र
────────────────────────────────────────────────
CASE NUMBER   : ${c.number}
DATE          : ${date}
POLICE STATION: [Station Name]

ACCUSED       : ${c.name}
SECTIONS      : ${c.sections}
ITEMS SEIZED  : ${c.items}

STATEMENT SUMMARY
─────────────────
${c.statement}

Submitted to the Honourable Court.
Signature of I.O.: ______________________
Designation      : ______________________`;
    else if (docType==='medical') body =
`GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS
MEDICAL EXAMINATION REQUEST / चिकित्सा परीक्षण अनुरोध
────────────────────────────────────────────────
To, The Medical Superintendent / CMO

Case No. : ${c.number}
Date     : ${date}
Name     : ${c.name}

Please conduct a medical examination of the above individual
in connection with the registered case and submit your report.

Authorised Signatory: ______________________`;
    else body =
`GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS
POLICE CUSTODY REMAND REQUEST / पुलिस अभिरक्षा प्रेषण
────────────────────────────────────────────────
To, The Honourable Magistrate

Case No.  : ${c.number}
Date      : ${date}
Accused   : ${c.name}
Sections  : ${c.sections}

REQUEST FOR 14-DAY POLICE CUSTODY REMAND

The accused requires police custody for further investigation,
interrogation and recovery of evidence and co-accused.

Submitted by : ______________________________
Rank         : ______________________________`;

    const doc = { id: Date.now().toString(), body, type: docType, caseNum: c.number, date };
    setDocs(prev => [doc, ...prev]);
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
          {tab==='dashboard' && <>
            <div className="page-title"><Ic.Dash />{t('dashboard')}</div>
            <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('dashboard')}</span></div>
            <div className="status-filters">
              {(['All','Active','Open','Solved','Unsolved','Closed'] as const).map(key => (
                <button key={key} className={`status-chip ${statusFilter===key?'active':''}`} onClick={()=>{setStatusFilter(key);setTab('cases')}}>
                  <strong>{statusCounts[key]}</strong>
                  <span>{key}</span>
                </button>
              ))}
            </div>
            <div className="card">
              <div className="card-head">
                <span className="card-title"><Ic.Folder />Recent Cases</span>
                <button className="btn btn-primary btn-sm" onClick={()=>setTab('cases')}><Ic.ChevR />View All</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Case No.</th><th>Accused</th><th>Sections</th><th>Status</th></tr></thead>
                  <tbody>
                    {cases.slice(0,5).map(c=>(
                      <tr key={c.id}>
                        <td><span className="case-no">{c.number}</span></td>
                        <td style={{fontWeight:600}}>{c.name}</td>
                        <td><span className="tag">{c.sections}</span></td>
                        <td><StatusBadge status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><span className="card-title"><Ic.Alert />{t('auditLog')}</span></div>
              <div className="card-body">
                {auditLogs.slice(0,6).map(a => (
                  <div key={a.id} className="audit-row">
                    <div className="audit-msg">{a.message}</div>
                    <div className="audit-time">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ── CASES ── */}
          {tab==='cases' && <>
            <div className="page-title"><Ic.Folder />{t('cases')}</div>
            <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('cases')}</span></div>
            <div className="toolbar">
              <div className="search-box">
                <Ic.Search />
                <input type="text" placeholder="Search by case no., name, section…" value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={()=>setShowCaseModal(true)}><Ic.Plus />{t('newCase')}</button>
            </div>
            <div className="status-filters" style={{marginBottom:16}}>
              {(['All','Active','Open','Solved','Unsolved','Closed'] as const).map(key => (
                <button key={key} className={`status-chip ${statusFilter===key?'active':''}`} onClick={()=>setStatusFilter(key)}>
                  <strong>{statusCounts[key]}</strong><span>{key}</span>
                </button>
              ))}
            </div>
            <div className="filter-bar">
              <div>Showing <strong>{statusFilter}</strong> cases — {filtered.length} record(s)</div>
              {statusFilter!=='All' && <button className="btn btn-outline btn-sm" onClick={()=>setStatusFilter('All')}>Clear filter</button>}
            </div>
            {filtered.length===0 ? (
              <div className="empty"><Ic.Folder /><h3>No cases found</h3><p>Try a different search or register a new case.</p></div>
            ) : (
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Case No.</th><th>Accused</th><th>Sections</th><th>Evidence / Items</th><th>Summary</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(c=>(
                        <tr key={c.id}>
                          <td><span className="case-no">{c.number}</span></td>
                          <td style={{fontWeight:600}}>{c.name}</td>
                          <td><span className="tag">{c.sections}</span></td>
                          <td style={{fontSize:13}}>{c.items}</td>
                          <td style={{fontSize:13,maxWidth:180,color:'var(--gray-600)'}}>{c.statement}</td>
                          <td><StatusBadge status={c.status} /></td>
                          <td><button className="btn btn-ghost-red btn-sm" onClick={()=>delCase(c.id)}><Ic.Trash />Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>}

          {/* ── DOCUMENTS ── */}
          {tab==='documents' && <>
            <div className="page-title"><Ic.FileOut />{t('documents')}</div>
            <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('documents')}</span></div>
            <div className="card" style={{marginBottom:22}}>
              <div className="card-head"><span className="card-title"><Ic.File />Generate Document</span></div>
              <div className="card-body">
                <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'flex-end'}}>
                  <div className="form-group" style={{flex:1,minWidth:200,margin:0}}>
                    <label className="form-label">Select Case</label>
                    <select className="form-input" value={selCase} onChange={e=>setSelCase(e.target.value)}>
                      {cases.map(c=><option key={c.id} value={c.id}>{c.number} — {c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{flex:1,minWidth:200,margin:0}}>
                    <label className="form-label">Document Type</label>
                    <select className="form-input" value={docType} onChange={e=>setDocType(e.target.value)}>
                      <option value="chargesheet">Purvani Chargesheet</option>
                      <option value="medical">Medical Examination Letter</option>
                      <option value="remand">Remand Request</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={genDoc} style={{flexShrink:0}}><Ic.FileOut />{t('generateDoc')}</button>
                </div>
              </div>
            </div>
            {docs.length===0 ? (
              <div className="empty"><Ic.File /><h3>No documents yet</h3><p>Select a case and document type above, then click Generate.</p></div>
            ) : docs.map((d,i)=>(
              <div key={d.id}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:'var(--navy)'}}>📄 Document #{i+1} — {d.caseNum} <span style={{color:'var(--gray-400)',fontWeight:400}}>({d.date})</span></span>
                  <button className="btn btn-ghost-red btn-sm" onClick={()=>setDocs(prev=>prev.filter(x=>x.id!==d.id))}><Ic.Trash />Remove</button>
                </div>
                <pre className="doc-pre">{d.body}</pre>
              </div>
            ))}
          </>}

          {/* ── DIARY WITH MULTI-LANGUAGE SPEECH RECOGNITION ── */}
          {tab==='diary' && <>
            <div className="page-title"><Ic.Book />{t('diary')}</div>
            <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('diary')}</span></div>

            <div className="card" style={{marginBottom:22}}>
              <div className="card-head"><span className="card-title"><Ic.Check />{t('autoDiary')}</span></div>
              <div className="card-body">
                <div style={{display:'grid',gap:10}}>
                  {diarySuggestions.map(s => (
                    <button key={s.title} className="suggestion-btn" onClick={() => addDiaryEntry(s.title, s.note)}>
                      <div className="suggestion-btn-icon">{s.icon}</div>
                      <div>
                        <div className="suggestion-btn-title">{s.title}</div>
                        <div className="suggestion-btn-sub">{s.note}</div>
                      </div>
                      <div style={{marginLeft:'auto',color:'var(--gray-300)'}}>
                        <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2}}><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{marginBottom:22}}>
              <div className="card-head">
                <span className="card-title"><Ic.Plus />Add Diary Entry</span>
                {micSupported && (
                  <div style={{display:'flex',alignItems:'center',gap:10, flexWrap:'wrap'}}>
                    {recording && <div className="mic-status"><div className="mic-dot"/><span style={{color:'var(--red)'}}>🔴 Recording...</span></div>}
                    
                    <div style={{position:'relative'}}>
                      <button
                        className="btn-outline btn-sm"
                        onClick={() => setShowLangSelector(!showLangSelector)}
                        style={{display:'flex',alignItems:'center',gap:'5px', padding:'6px 12px'}}
                      >
                        <span>{getCurrentLangDisplay()}</span>
                        <span>▼</span>
                      </button>
                      {showLangSelector && (
                        <div className="language-dropdown">
                          {languageOptions.map(lang => (
                            <button
                              key={lang.code}
                              className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                              onClick={() => {
                                changeLanguage(lang.code);
                                setShowLangSelector(false);
                              }}
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
                    
                    <button
                      className={`btn-mic ${recording ? 'recording' : ''}`}
                      onClick={toggleMic}
                    >
                      {recording ? <Ic.MicOff /> : <Ic.Mic />}
                      {recording ? 'Stop Recording' : 'Speak to Type'}
                    </button>
                  </div>
                )}
              </div>
              <div className="card-body">
                {micSupported && (
                  <div className="alert alert-info" style={{marginBottom:14}}>
                    <Ic.Mic />
                    <div>
                      <strong>Voice Dictation Available</strong> — Click <em>Speak to Type</em> and speak your case notes aloud.
                      <span style={{display:'block', marginTop:'4px'}}>
                        🎤 <strong>Supported Languages:</strong> Hindi, English, Gujarati, Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, Punjabi
                        <br />📌 <strong>Current:</strong> {getCurrentLangDisplay()}
                      </span>
                    </div>
                  </div>
                )}
                
                {micError && (
                  <div className="alert alert-error" style={{marginBottom:14}}>
                    <Ic.Alert /> {micError}
                  </div>
                )}
                
                <div className="form-group" style={{marginBottom:12}}>
                  <label className="form-label">CASE NOTE / ACTIVITY DESCRIPTION</label>
                  <textarea
                    className="form-input"
                    rows={6}
                    placeholder={recording ? `🎤 Listening... Speak now...` : 'Type your case note here or click "Speak to Type" for voice dictation...'}
                    value={recording && speechBuffer ? newDiaryNote + (newDiaryNote ? ' ' : '') + speechBuffer : newDiaryNote}
                    onChange={e => setNewDiaryNote(e.target.value)}
                    style={{borderColor: recording ? 'var(--red)' : undefined}}
                  />
                  {recording && (
                    <div className="alert alert-success" style={{marginTop:'8px', padding:'6px 12px'}}>
                      <div className="mic-dot" style={{display:'inline-block', marginRight:'8px'}} />
                      <span>🔴 Recording active - Speaking in {languageOptions.find(l => l.code === currentLanguage)?.name}</span>
                    </div>
                  )}
                </div>
                
                <div style={{display:'flex',gap:10,alignItems:'center', flexWrap:'wrap'}}>
                  <button className="btn btn-primary" onClick={() => {
                    if (!newDiaryNote.trim()) {
                      alert('Please enter or speak a case note before adding.');
                      return;
                    }
                    addDiaryEntry('Case Note Entry', newDiaryNote.trim());
                  }}>
                    <Ic.Plus /> Add Entry
                  </button>
                  {newDiaryNote && (
                    <button className="btn btn-outline btn-sm" onClick={() => setNewDiaryNote('')}>Clear</button>
                  )}
                </div>
                
                <div style={{marginTop:'16px', padding:'10px', background:'var(--gray-50)', borderRadius:'var(--r-sm)', fontSize:'11px'}}>
                  <strong>💡 Tips:</strong> Select language from dropdown, click mic, speak clearly, then Add Entry.
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><span className="card-title"><Ic.Calendar />Timeline — {selectedCase?.number}</span></div>
              <div className="card-body">
                {diaryForCase.length===0 ? (
                  <div className="empty"><Ic.Book /><h3>No diary entries yet</h3></div>
                ) : (
                  diaryForCase.map(entry => (
                    <div key={entry.id} className="diary-entry">
                      <div className="diary-entry-title">{entry.title}</div>
                      <div className="diary-entry-date">📅 {entry.date}</div>
                      <div className="diary-entry-note">{entry.note}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>}

          {/* ── LEGAL ── */}
          {tab==='legal' && <>
            <div className="page-title"><Ic.Scale />{t('legal')}</div>
            <div className="breadcrumb">Home <span className="breadcrumb-sep">›</span> <span>{t('legal')}</span></div>
            <div className="card" style={{marginBottom:22}}>
              <div className="card-head"><span className="card-title"><Ic.Folder />{t('caseDetails')}</span></div>
              <div className="card-body" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                <div>
                  <div className="form-group" style={{marginBottom:14}}><label className="form-label">Case Number</label><div style={{fontWeight:700,color:'var(--navy)'}}>{selectedCase?.number}</div></div>
                  <div className="form-group" style={{marginBottom:14}}><label className="form-label">Accused</label><div style={{fontWeight:600}}>{selectedCase?.name}</div></div>
                  <div className="form-group" style={{marginBottom:0}}><label className="form-label">Sections</label><div><span className="tag">{selectedCase?.sections}</span></div></div>
                </div>
                <div>
                  <div className="form-group" style={{marginBottom:14}}><label className="form-label">Evidence / Items</label><div style={{fontSize:13}}>{selectedCase?.items}</div></div>
                  <div className="form-group" style={{marginBottom:14}}><label className="form-label">Status</label><div><StatusBadge status={selectedCase?.status || ''} /></div></div>
                  <div className="form-group" style={{marginBottom:0}}><label className="form-label">Case Summary</label><div style={{fontSize:13,color:'var(--gray-600)'}}>{selectedCase?.statement}</div></div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><span className="card-title"><Ic.Alert />{t('legalGuide')}</span></div>
              <div className="card-body">
                {legalIntelligence.map((line, idx) => (
                  <div key={idx} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 0',borderBottom:idx<legalIntelligence.length-1?'1px solid var(--gray-100)':'none'}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(0,51,102,.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                      <span style={{fontSize:11,fontWeight:700,color:'var(--navy)'}}>{idx+1}</span>
                    </div>
                    <div style={{fontSize:13,lineHeight:1.6}}>{line}</div>
                  </div>
                ))}
              </div>
            </div>
          </>}
        </div>

        <ChatSidebar messages={chatMessages} draft={chatDraft} onDraft={setChatDraft} onSend={handleAiSend} loading={chatLoading} />
      </div>

      <Footer />
      <LangModal />

      {showCaseModal && (
        <div className="overlay">
          <div className="modal" style={{maxWidth:510}}>
            <div className="modal-head">
              <h3><Ic.Plus />Register New Case</h3>
              <button className="modal-x" onClick={()=>{setShowCaseModal(false);setNcErr('');}}><Ic.X /></button>
            </div>
            <div className="modal-body">
              {ncErr && <div className="alert alert-error"><Ic.Alert />{ncErr}</div>}
              <div className="form-group">
                <label className="form-label">{t('accusedName')} *</label>
                <input className="form-input" placeholder="Full name of accused" value={nc.name} onChange={e=>setNc({...nc,name:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('sections')} *</label>
                <input className="form-input" placeholder="e.g. BNS 303, BNS 61" value={nc.sections} onChange={e=>setNc({...nc,sections:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('itemsSeized')}</label>
                <input className="form-input" placeholder="e.g. Mobile Phone, Laptop" value={nc.items} onChange={e=>setNc({...nc,items:e.target.value})} />
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">{t('statement')}</label>
                <textarea className="form-input" rows={3} placeholder="Brief FIR / case summary…" value={nc.statement} onChange={e=>setNc({...nc,statement:e.target.value})} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline btn-sm" onClick={()=>{setShowCaseModal(false);setNcErr('');}}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={addCase}><Ic.Plus />{t('createCase')}</button>
            </div>
          </div>
        </div>
      )}

      {showDocPreview && docPreview && (
        <div className="overlay">
          <div className="modal" style={{maxWidth:760}}>
            <div className="modal-head">
              <h3><Ic.File />Document Preview — {docPreview.caseNum}</h3>
              <button className="modal-x" onClick={()=>setShowDocPreview(false)}><Ic.X /></button>
            </div>
            <div className="modal-body">
              <pre className="doc-pre" style={{whiteSpace:'pre-wrap',wordBreak:'break-word',fontSize:13}}>{docPreview.body}</pre>
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline btn-sm" onClick={()=>setShowDocPreview(false)}>Close</button>
              <button className="btn btn-primary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <>
      <InjectStyles />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<PrivateRoute />} />
      </Routes>
    </>
  );
}

function PrivateRoute() {
  const { isAuth } = useAuth();
  return isAuth ? <DashboardPage /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Router>
          <AppInner />
        </Router>
      </AuthProvider>
    </LangProvider>
  );
}