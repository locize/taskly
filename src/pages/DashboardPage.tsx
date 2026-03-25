import { useTodos } from '../context/TodoContext'
import type { Category } from '../types'
import styles from './DashboardPage.module.css'
import { useTranslation, Trans } from 'react-i18next'

const CATEGORY_LABELS: Record<Category, string> = {
  work: 'Work',
  personal: 'Personal',
  shopping: 'Shopping',
  health: 'Health',
}

const CATEGORY_COLORS: Record<Category, string> = {
  work: '#c8622a',
  personal: '#6c63ac',
  shopping: '#2a8c6c',
  health: '#2a6c8c',
}

const CATEGORY_ICONS: Record<Category, string> = {
  work: '💼',
  personal: '🌱',
  shopping: '🛒',
  health: '💪',
}

function formatRelativeDate(dateStr: string): string {
  const diff = Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000)
  // i18next-instrument-ignore
  if (diff < 0) return 'Overdue'
  // i18next-instrument-ignore
  if (diff === 0) return 'Today'
  // i18next-instrument-ignore
  if (diff === 1) return 'Tomorrow'
  // i18next-instrument-ignore
  return `In ${diff} days`
}

function isDueUrgent(dateStr: string) {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000) <= 1
}

// A fake streak value for demo purposes — great i18n example for pluralization
const STREAK_DAYS = 5

export default function DashboardPage() {
  const { t } = useTranslation()
  const { todos, profile } = useTodos()

  const totalTasks    = todos.length
  const completedTasks = todos.filter(t => t.completed).length
  const activeTasks   = totalTasks - completedTasks
  const overdueTasks  = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const highPriorityCount = todos.filter(t => !t.completed && t.priority === 'high').length

  const dueSoon = todos
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 4)

  const recentlyCompleted = todos
    .filter(t => t.completed)
    .slice(0, 3)

  const categories = (['work', 'personal', 'shopping', 'health'] as Category[])
    .map(cat => ({
      key: cat,
      label: CATEGORY_LABELS[cat],
      icon: CATEGORY_ICONS[cat],
      color: CATEGORY_COLORS[cat],
      total: todos.filter(t => t.category === cat).length,
      done: todos.filter(t => t.category === cat && t.completed).length,
    }))
    .filter(c => c.total > 0)

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // First name only for the greeting
  const firstName = profile.name.split(' ')[0]

  return (
    <div className={styles.page}>
      {/* Greeting */}
      <header className={styles.header}>
        <div className={styles.greetingRow}>
          <div>
            <p className={styles.greeting}>{t('greetingFirstname', '{{greeting}}, {{firstName}}! 👋', { greeting, firstName })}</p>
            <h1 className={styles.title}>{t('heresYourOverview', 'Here\'s your overview')}</h1>
            <h2>{t('subTitle', 'some sub title here')}</h2>
          </div>
          <div className={styles.streakBadge} title={t('streak_daysdayStreak', '{{STREAK_DAYS}}-day streak', { STREAK_DAYS })}>
            <span className={styles.streakFlame}>{t('key', '🔥')}</span>
            <div>
              <span className={styles.streakNum}>{STREAK_DAYS}</span>
              <span className={styles.streakLabel}>
                {/* @ts-ignore */}
                {t('dayStreak', { defaultValue_one: 'day streak', defaultValue_other: 'day streak', count: STREAK_DAYS })}
              </span>
            </div>
          </div>
        </div>
        <p className={styles.subtitle}>
          {t('youHaveCountTasksLeftToComplete', { defaultValue_zero: 'You have no tasks left — enjoy your day!', defaultValue_one: 'You have 1 task left to complete.', defaultValue_other: 'You have {{count}} tasks left to complete.', count: activeTasks })}
          {overdueTasks > 0 && (
            <span className={styles.overdueAlert}>
              {' '}
              {t('countTasksAreOverdue', { defaultValue_one: '⚠️ 1 task is overdue.', defaultValue_other: '⚠️ {{count}} tasks are overdue.', count: overdueTasks })}
            </span>
          )}
        </p>
      </header>

      {/* Stats grid */}
      <section aria-label={t('taskStatistics', 'Task statistics')}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard} data-accent="orange">
            <span className={styles.statNumber}>{activeTasks}</span>
            <span className={styles.statLabel}>{t('activeTasks', 'Active tasks')}</span>
          </div>
          <div className={styles.statCard} data-accent="green">
            <span className={styles.statNumber}>{completedTasks}</span>
            <span className={styles.statLabel}>{t('completed', 'Completed')}</span>
          </div>
          <div className={styles.statCard} data-accent="purple">
            <span className={styles.statNumber}>{t('completionpct', '{{completionPct}}%', { completionPct })}</span>
            <span className={styles.statLabel}>{t('completionRate', 'Completion rate')}</span>
          </div>
          <div className={styles.statCard} data-accent="red">
            <span className={styles.statNumber}>{highPriorityCount}</span>
            <span className={styles.statLabel}>{t('highPriority', 'High priority')}</span>
          </div>
        </div>
      </section>

      <div className={styles.twoCol}>
        {/* Due soon */}
        <section className={styles.section} aria-label={t('upcomingDeadlines', 'Upcoming deadlines')}>
          <h2 className={styles.sectionTitle}><Trans i18nKey="spanspanDueSoon"><span>⏰</span> Due soon</Trans></h2>
          {dueSoon.length > 0 ? (
            <ul className={styles.dueList}>
              {dueSoon.map(todo => (
                <li key={todo.id} className={styles.dueItem}>
                  <div className={styles.dueText}>{todo.text}</div>
                  <div className={styles.dueMeta}>
                    <span
                      className={styles.categoryPill}
                      style={{ '--cat': CATEGORY_COLORS[todo.category] } as React.CSSProperties}
                    >
                      {CATEGORY_ICONS[todo.category]} {CATEGORY_LABELS[todo.category]}
                    </span>
                    <span
                      className={styles.dueTag}
                      data-urgent={isDueUrgent(todo.dueDate!) ? 'true' : 'false'}
                    >
                      {formatRelativeDate(todo.dueDate!)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{t('noUpcomingDeadlines', 'No upcoming deadlines 🎉')}</p>
          )}
        </section>

        {/* By category */}
        <section className={styles.section} aria-label={t('tasksByCategory', 'Tasks by category')}>
          <h2 className={styles.sectionTitle}><Trans i18nKey="spanspanByCategory"><span>📂</span> By category</Trans></h2>
          {categories.length > 0 ? (
            <div className={styles.categoryList}>
              {categories.map(cat => (
                <div key={cat.key} className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <span>{cat.icon} {cat.label}</span>
                    <span className={styles.categoryCount}>{t('doneOfTotalDone', '{{done}} of {{total}} done', { done: cat.done, total: cat.total })}</span>
                  </div>
                  <div className={styles.categoryTrack}>
                    <div
                      className={styles.categoryFill}
                      style={{
                        width: `${cat.total > 0 ? (cat.done / cat.total) * 100 : 0}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>{t('noTasksYetAddSome', 'No tasks yet. Add some!')}</p>
          )}
        </section>
      </div>

      {/* Recently completed */}
      {recentlyCompleted.length > 0 && (
        <section className={styles.section} aria-label={t('recentlyCompleted', 'Recently completed')}>
          <h2 className={styles.sectionTitle}><Trans i18nKey="spanspanRecentlyCompleted"><span>✅</span> Recently completed</Trans></h2>
          <ul className={styles.recentList}>
            {recentlyCompleted.map(todo => (
              <li key={todo.id} className={styles.recentItem}>
                <span className={styles.recentCheck}>✓</span>
                <span className={styles.recentText}>{todo.text}</span>
                <span className={styles.recentCat}>
                  {CATEGORY_ICONS[todo.category]} {CATEGORY_LABELS[todo.category]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
