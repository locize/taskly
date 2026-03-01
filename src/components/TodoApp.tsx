import { useState, useId } from 'react'
import styles from './TodoApp.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'active' | 'completed'

interface Todo {
  id: number
  text: string
  completed: boolean
}

// ─── Seed data ────────────────────────────────────────────────────────────────

// i18next-instrument-ignore
const INITIAL_TODOS: Todo[] = [
  { id: 1, text: 'Design the app mockup', completed: true },
  { id: 2, text: 'Set up the Vite project', completed: true },
  { id: 3, text: 'Add i18next for translations', completed: false },
  { id: 4, text: 'Write the tutorial blog post', completed: false },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.itemCompleted : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={todo.completed}
      >
        {todo.completed && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <span className={styles.itemText}>{todo.text}</span>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>
    </li>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS)
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const inputId = useId()

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  function addTodo() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ])
    setInputValue('')
  }

  function toggleTodo(id: number) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addTodo()
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bgBlob} aria-hidden="true" />

      <main className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.logo}>✦</span>
            <p className={styles.tagline}>Stay on top of your day</p>
          </div>
          <h1 className={styles.title}>Taskly</h1>
          <div className={styles.stats}>
            <span className={styles.statBadge} data-variant="active">
              {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
            </span>
            {completedCount > 0 && (
              <span className={styles.statBadge} data-variant="done">
                {completedCount} done
              </span>
            )}
          </div>
        </header>

        {/* Card */}
        <div className={styles.card}>
          {/* Input area */}
          <div className={styles.inputArea}>
            <label htmlFor={inputId} className={styles.srOnly}>
              New task
            </label>
            <input
              id={inputId}
              className={styles.input}
              type="text"
              placeholder="Add a new task…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={120}
            />
            <button
              className={styles.addBtn}
              onClick={addTodo}
              disabled={!inputValue.trim()}
              aria-label="Add task"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add
            </button>
          </div>

          {/* Filter tabs */}
          <div className={styles.filters} role="tablist" aria-label="Filter tasks">
            {filters.map(f => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Todo list */}
          {filteredTodos.length > 0 ? (
            <ul className={styles.list} role="list">
              {filteredTodos.map(todo => (
                <TodoItem
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
                  ? 'No active tasks — enjoy your break!'
                  : 'No tasks yet. Add one above!'}
              </p>
            </div>
          )}

          {/* Footer */}
          {completedCount > 0 && (
            <div className={styles.footer}>
              <button className={styles.clearBtn} onClick={clearCompleted}>
                Clear completed ({completedCount})
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
