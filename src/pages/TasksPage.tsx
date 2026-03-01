import { useState, useId } from 'react'
import { useTodos } from '../context/TodoContext'
import type { FilterType, Priority, Category } from '../types'
import styles from './TasksPage.module.css'

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'green',
  medium: 'orange',
  high: 'red',
}

const CATEGORY_LABELS: Record<Category, string> = {
  work: 'Work',
  personal: 'Personal',
  shopping: 'Shopping',
  health: 'Health',
}

const CATEGORY_ICONS: Record<Category, string> = {
  work: '💼',
  personal: '🌱',
  shopping: '🛒',
  health: '💪',
}

// ─── Add Task Form ────────────────────────────────────────────────────────────

interface AddFormProps {
  onAdd: (text: string, priority: Priority, category: Category, dueDate?: string) => void
}

function AddForm({ onAdd }: AddFormProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState<Category>('work')
  const [dueDate, setDueDate] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputId = useId()

  function handleSubmit() {
    if (!text.trim()) return
    onAdd(text.trim(), priority, category, dueDate || undefined)
    setText('')
    setDueDate('')
    setPriority('medium')
    setCategory('work')
    setExpanded(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={styles.addForm}>
      <div className={styles.addRow}>
        <label htmlFor={inputId} className={styles.srOnly}>New task</label>
        <input
          id={inputId}
          className={styles.addInput}
          type="text"
          placeholder="Add a new task…"
          value={text}
          onChange={e => {
            setText(e.target.value)
            if (e.target.value && !expanded) setExpanded(true)
          }}
          onKeyDown={handleKeyDown}
          maxLength={120}
        />
        <button
          className={styles.expandBtn}
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-label="More options"
          title="More options"
        >
          ⚙
        </button>
        <button
          className={styles.addBtn}
          onClick={handleSubmit}
          disabled={!text.trim()}
          aria-label="Add task"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add task
        </button>
      </div>

      {expanded && (
        <div className={styles.addOptions}>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Priority</label>
            <div className={styles.optionButtons}>
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  className={`${styles.optionBtn} ${priority === p ? styles.optionBtnActive : ''}`}
                  data-priority={p}
                  onClick={() => setPriority(p)}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Category</label>
            <div className={styles.optionButtons}>
              {(['work', 'personal', 'shopping', 'health'] as Category[]).map(c => (
                <button
                  key={c}
                  className={`${styles.optionBtn} ${category === c ? styles.optionBtnActive : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel} htmlFor="due-date">Due date</label>
            <input
              id="due-date"
              type="date"
              className={styles.dateInput}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Task Item ────────────────────────────────────────────────────────────────

interface TaskItemProps {
  todo: ReturnType<typeof useTodos>['todos'][number]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ todo, onToggle, onDelete }: TaskItemProps) {
  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const diff = Math.round((d.getTime() - Date.now()) / 86400000)
    if (diff < 0) return `Overdue`
    if (diff === 0) return 'Due today'
    if (diff === 1) return 'Due tomorrow'
    return `Due ${d.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
  }

  function isOverdue(dateStr: string) {
    return new Date(dateStr).getTime() < Date.now()
  }

  return (
    <li className={`${styles.taskItem} ${todo.completed ? styles.completed : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={todo.completed}
      >
        {todo.completed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className={styles.taskBody}>
        <span className={styles.taskText}>{todo.text}</span>
        <div className={styles.taskMeta}>
          <span className={`${styles.priorityDot}`} data-priority={PRIORITY_COLORS[todo.priority]} title={`${PRIORITY_LABELS[todo.priority]} priority`} />
          <span className={styles.categoryTag}>
            {CATEGORY_ICONS[todo.category]} {CATEGORY_LABELS[todo.category]}
          </span>
          {todo.dueDate && !todo.completed && (
            <span
              className={styles.dueChip}
              data-overdue={isOverdue(todo.dueDate) ? 'true' : 'false'}
            >
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </li>
  )
}

// ─── Tasks Page ───────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

const CATEGORY_FILTER_OPTIONS: { key: Category | 'all'; label: string }[] = [
  { key: 'all', label: 'All categories' },
  { key: 'work', label: '💼 Work' },
  { key: 'personal', label: '🌱 Personal' },
  { key: 'shopping', label: '🛒 Shopping' },
  { key: 'health', label: '💪 Health' },
]

export default function TasksPage() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos()
  const [filter, setFilter] = useState<FilterType>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  const filteredTodos = todos.filter(todo => {
    const statusMatch =
      filter === 'all' || (filter === 'active' ? !todo.completed : todo.completed)
    const categoryMatch = categoryFilter === 'all' || todo.category === categoryFilter
    return statusMatch && categoryMatch
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Tasks</h1>
        <div className={styles.headerStats}>
          <span className={styles.statChip} data-color="orange">
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
          </span>
          {completedCount > 0 && (
            <span className={styles.statChip} data-color="green">
              {completedCount} completed
            </span>
          )}
        </div>
      </header>

      <AddForm onAdd={addTodo} />

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup} role="tablist" aria-label="Filter by status">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`${styles.filterTab} ${filter === f.key ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          className={styles.categorySelect}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as Category | 'all')}
          aria-label="Filter by category"
        >
          {CATEGORY_FILTER_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className={styles.listWrap}>
        {filteredTodos.length > 0 ? (
          <ul className={styles.list} role="list">
            {filteredTodos.map(todo => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              {filter === 'completed' ? '🎉' : '✦'}
            </span>
            <p>
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'All done — great work!'
                : 'No tasks here. Add one above!'}
            </p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {completedCount > 0 && (
        <div className={styles.footerActions}>
          <button className={styles.clearBtn} onClick={clearCompleted}>
            Clear {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'}
          </button>
        </div>
      )}
    </div>
  )
}
