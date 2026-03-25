import type { Page } from '../types'
import type { ReactNode } from 'react'
import { useTodos } from '../context/TodoContext'
import styles from './Sidebar.module.css'
import { useTranslation } from 'react-i18next'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const NAV_ITEMS: { page: Page; label: string; icon: ReactNode }[] = [
  {
    // t('navItem.dashboard', 'Dashboard')
    page: 'dashboard',
    // i18next-instrument-ignore
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    // t('navItem.tasks', 'My Tasks')
    page: 'tasks',
    // i18next-instrument-ignore
    label: 'My Tasks',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    // t('navItem.settings', 'Settings')
    page: 'settings',
    // i18next-instrument-ignore
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t } = useTranslation()
  const { todos, profile } = useTodos()
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  const initials = profile.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>
        {/* i18next-instrument-ignore */}
        <span className={styles.brandMark}>✦</span>
        {/* i18next-instrument-ignore */}
        <span className={styles.brandName}>Taskly</span>
      </div>

      {/* User profile */}
      <div className={styles.profile}>
        <div
          className={styles.avatar}
          style={{ background: profile.avatarColor }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>{profile.name}</span>
          <span className={styles.profileEmail}>{profile.email}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label={t('mainNavigation', 'Main navigation')}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.page}
            className={`${styles.navItem} ${currentPage === item.page ? styles.active : ''}`}
            onClick={() => onNavigate(item.page)}
            aria-current={currentPage === item.page ? 'page' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={styles.navLabel}>{t(`navItem.${item.page}`, item.label)}</span>
            {item.page === 'tasks' && activeCount > 0 && (
              <span className={styles.badge} aria-label={t('activecountActiveTasks', '{{activeCount}} active tasks', { activeCount })}>
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Progress footer */}
      <div className={styles.footer}>
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span>{t('todaysProgress', 'Today\'s progress')}</span>
            <span>{t('completedcountcountTasks', { defaultValue_one: '{{completedCount}}/{{count}} task', defaultValue_other: '{{completedCount}}/{{count}} tasks', count: totalCount, completedCount })}</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: totalCount
                  ? `${(completedCount / totalCount) * 100}%`
                  : '0%',
              }}
            />
          </div>
          {totalCount > 0 && completedCount === totalCount && (
            <p className={styles.allDone}>{t('allDoneGreatWork2', 'All done! Great work 🎉')}</p>
          )}
        </div>
      </div>
    </aside>
  )
}
