import { useTodos } from '../context/TodoContext'
import type { Category } from '../types'
import styles from './DashboardPage.module.css'

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
  if (diff < 0) return 'Overdue'
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

function isDueUrgent(dateStr: string) {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000) <= 1
}

// A fake streak value for demo purposes — great i18n example for pluralization
const STREAK_DAYS = 5

export default function DashboardPage() {
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
            <p className={styles.greeting}>{greeting}, {firstName}! 👋</p>
            <h1 className={styles.title}>Here's your overview</h1>
          </div>
          <div className={styles.streakBadge} title={`${STREAK_DAYS}-day streak`}>
            <span className={styles.streakFlame}>🔥</span>
            <div>
              <span className={styles.streakNum}>{STREAK_DAYS}</span>
              <span className={styles.streakLabel}>
                {/* @ts-ignore */}
                {STREAK_DAYS === 1 ? 'day streak' : 'day streak'}
              </span>
            </div>
          </div>
        </div>
        <p className={styles.subtitle}>
          {activeTasks === 0
            ? 'You have no tasks left — enjoy your day!'
            : activeTasks === 1
            ? 'You have 1 task left to complete.'
            : `You have ${activeTasks} tasks left to complete.`}
          {overdueTasks > 0 && (
            <span className={styles.overdueAlert}>
              {' '}
              {overdueTasks === 1
                ? '⚠️ 1 task is overdue.'
                : `⚠️ ${overdueTasks} tasks are overdue.`}
            </span>
          )}
        </p>
      </header>

      {/* Stats grid */}
      <section aria-label="Task statistics">
        <div className={styles.statsGrid}>
          <div className={styles.statCard} data-accent="orange">
            <span className={styles.statNumber}>{activeTasks}</span>
            <span className={styles.statLabel}>Active tasks</span>
          </div>
          <div className={styles.statCard} data-accent="green">
            <span className={styles.statNumber}>{completedTasks}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statCard} data-accent="purple">
            <span className={styles.statNumber}>{completionPct}%</span>
            <span className={styles.statLabel}>Completion rate</span>
          </div>
          <div className={styles.statCard} data-accent="red">
            <span className={styles.statNumber}>{highPriorityCount}</span>
            <span className={styles.statLabel}>High priority</span>
          </div>
        </div>
      </section>

      <div className={styles.twoCol}>
        {/* Due soon */}
        <section className={styles.section} aria-label="Upcoming deadlines">
          <h2 className={styles.sectionTitle}>
            <span>⏰</span> Due soon
          </h2>
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
            <p className={styles.empty}>No upcoming deadlines 🎉</p>
          )}
        </section>

        {/* By category */}
        <section className={styles.section} aria-label="Tasks by category">
          <h2 className={styles.sectionTitle}>
            <span>📂</span> By category
          </h2>
          {categories.length > 0 ? (
            <div className={styles.categoryList}>
              {categories.map(cat => (
                <div key={cat.key} className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <span>{cat.icon} {cat.label}</span>
                    <span className={styles.categoryCount}>
                      {cat.done} of {cat.total} done
                    </span>
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
            <p className={styles.empty}>No tasks yet. Add some!</p>
          )}
        </section>
      </div>

      {/* Recently completed */}
      {recentlyCompleted.length > 0 && (
        <section className={styles.section} aria-label="Recently completed">
          <h2 className={styles.sectionTitle}>
            <span>✅</span> Recently completed
          </h2>
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
