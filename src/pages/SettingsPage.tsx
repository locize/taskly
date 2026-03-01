import { useState } from 'react'
import { useTodos } from '../context/TodoContext'
import styles from './SettingsPage.module.css'

// These are the languages that will be wired up with i18next in the tutorial.
const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
]

const AVATAR_COLORS = [
  '#c8622a', '#6c63ac', '#2a8c6c', '#2a6c8c',
  '#a02060', '#c89428', '#3a6ab0', '#5c8c2a',
]

// ─── Toggle component ─────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean
  onChange: () => void
  id: string
  label: string
  description?: string
}

function Toggle({ checked, onChange, id, label, description }: ToggleProps) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <label className={styles.toggleLabel} htmlFor={id}>{label}</label>
        {description && <p className={styles.toggleDesc}>{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={onChange}
      >
        <span className={styles.toggleThumb} />
        <span className={styles.srOnly}>{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { settings, profile, notifications, updateSettings, updateProfile, updateNotifications } = useTodos()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(profile.name)
  const [editingEmail, setEditingEmail] = useState(false)
  const [emailInput, setEmailInput] = useState(profile.email)

  const initials = profile.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function saveName() {
    if (nameInput.trim()) updateProfile({ name: nameInput.trim() })
    else setNameInput(profile.name)
    setEditingName(false)
  }

  function saveEmail() {
    if (emailInput.trim()) updateProfile({ email: emailInput.trim() })
    else setEmailInput(profile.email)
    setEditingEmail(false)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your profile and preferences</p>
      </header>

      <div className={styles.sections}>

        {/* ── Profile ─────────────────────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Profile</h2>
            <p className={styles.sectionDesc}>Your personal information shown in the app.</p>
          </div>

          <div className={styles.profileCard}>
            {/* Avatar */}
            <div className={styles.avatarArea}>
              <div
                className={styles.avatar}
                style={{ background: profile.avatarColor }}
                aria-label="User avatar"
              >
                {initials}
              </div>
              <div className={styles.colorPicker} aria-label="Choose avatar color">
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    className={`${styles.colorDot} ${profile.avatarColor === color ? styles.colorDotActive : ''}`}
                    style={{ background: color }}
                    onClick={() => updateProfile({ avatarColor: color })}
                    aria-label={`Select color ${color}`}
                    aria-pressed={profile.avatarColor === color}
                  />
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className={styles.profileFields}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full name</label>
                {editingName ? (
                  <div className={styles.fieldEditRow}>
                    <input
                      className={styles.fieldInput}
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                      autoFocus
                      maxLength={60}
                    />
                    <button className={styles.saveBtn} onClick={saveName}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => { setNameInput(profile.name); setEditingName(false) }}>Cancel</button>
                  </div>
                ) : (
                  <div className={styles.fieldValueRow}>
                    <span className={styles.fieldValue}>{profile.name}</span>
                    <button className={styles.editBtn} onClick={() => setEditingName(true)}>Edit</button>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email address</label>
                {editingEmail ? (
                  <div className={styles.fieldEditRow}>
                    <input
                      className={styles.fieldInput}
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEmail(); if (e.key === 'Escape') setEditingEmail(false) }}
                      autoFocus
                      maxLength={80}
                    />
                    <button className={styles.saveBtn} onClick={saveEmail}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => { setEmailInput(profile.email); setEditingEmail(false) }}>Cancel</button>
                  </div>
                ) : (
                  <div className={styles.fieldValueRow}>
                    <span className={styles.fieldValue}>{profile.email}</span>
                    <button className={styles.editBtn} onClick={() => setEditingEmail(true)}>Edit</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Language ────────────────────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Language</h2>
            <p className={styles.sectionDesc}>
              Choose the display language for the interface.
            </p>
          </div>
          <div className={styles.languageGrid}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                className={`${styles.langBtn} ${settings.language === lang.code ? styles.langBtnActive : ''}`}
                onClick={() => updateSettings({ language: lang.code })}
                aria-pressed={settings.language === lang.code}
              >
                <span className={styles.langFlag}>{lang.flag}</span>
                <span className={styles.langName}>{lang.label}</span>
                {settings.language === lang.code && (
                  <span className={styles.langCheck} aria-hidden="true">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className={styles.hint}>
            ℹ️ Language switching will be fully functional after adding i18next in the tutorial.
          </p>
        </section>

        {/* ── Notifications ───────────────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <p className={styles.sectionDesc}>Control which reminders you receive.</p>
          </div>
          <div className={styles.toggleList}>
            <Toggle
              id="notif-due-soon"
              checked={notifications.dueSoonAlerts}
              onChange={() => updateNotifications({ dueSoonAlerts: !notifications.dueSoonAlerts })}
              label="Due soon alerts"
              description="Get reminded when tasks are due within 24 hours"
            />
            <Toggle
              id="notif-daily"
              checked={notifications.dailySummary}
              onChange={() => updateNotifications({ dailySummary: !notifications.dailySummary })}
              label="Daily summary"
              description="Receive a summary of your tasks every morning"
            />
            <Toggle
              id="notif-weekly"
              checked={notifications.weeklyReport}
              onChange={() => updateNotifications({ weeklyReport: !notifications.weeklyReport })}
              label="Weekly report"
              description="A weekly overview of your productivity and completed tasks"
            />
          </div>
        </section>

        {/* ── Dashboard preferences ────────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dashboard</h2>
            <p className={styles.sectionDesc}>Configure what you see on the overview.</p>
          </div>
          <div className={styles.toggleList}>
            <Toggle
              id="pref-completed"
              checked={settings.showCompletedInDashboard}
              onChange={() => updateSettings({ showCompletedInDashboard: !settings.showCompletedInDashboard })}
              label="Show completed tasks"
              description="Include completed tasks in the dashboard statistics"
            />
          </div>
        </section>

        {/* ── About ───────────────────────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>About</h2>
          </div>
          <div className={styles.aboutCard}>
            <div className={styles.aboutBrand}>
              <span className={styles.aboutMark}>✦</span>
              <span className={styles.aboutName}>Taskly</span>
            </div>
            <p className={styles.aboutVersion}>Version 1.0.0</p>
            <p className={styles.aboutStack}>Built with Vite · React · TypeScript</p>
            <p className={styles.aboutDesc}>
              A minimal task management app created as a starter project for the
              i18next internationalization tutorial.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
