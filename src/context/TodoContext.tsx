import { createContext, useContext, useState, ReactNode } from 'react'
import type { Todo, Category, Priority, UserProfile, NotificationPrefs } from '../types'

// ─── Seed data ────────────────────────────────────────────────────────────────

const INITIAL_TODOS: Todo[] = [
  {
    id: 1,
    text: 'Design the app mockup',
    completed: true,
    priority: 'high',
    category: 'work',
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 2,
    text: 'Set up Vite + React project',
    completed: true,
    priority: 'high',
    category: 'work',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 3,
    text: 'Add i18next for translations',
    completed: false,
    priority: 'high',
    category: 'work',
    createdAt: new Date(Date.now() - 86400000),
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  },
  {
    id: 4,
    text: 'Write the tutorial blog post',
    completed: false,
    priority: 'medium',
    category: 'work',
    createdAt: new Date(Date.now() - 86400000),
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
  },
  {
    id: 5,
    text: 'Buy groceries',
    completed: false,
    priority: 'low',
    category: 'shopping',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: 6,
    text: 'Morning run (30 min)',
    completed: true,
    priority: 'medium',
    category: 'health',
    createdAt: new Date(Date.now() - 3600000 * 8),
  },
  {
    id: 7,
    text: 'Call the dentist',
    completed: false,
    priority: 'medium',
    category: 'health',
    createdAt: new Date(Date.now() - 3600000 * 2),
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  },
  {
    id: 8,
    text: 'Read 20 pages',
    completed: false,
    priority: 'low',
    category: 'personal',
    createdAt: new Date(),
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppSettings {
  language: string
  showCompletedInDashboard: boolean
}

interface TodoContextValue {
  todos: Todo[]
  settings: AppSettings
  profile: UserProfile
  notifications: NotificationPrefs
  addTodo: (text: string, priority: Priority, category: Category, dueDate?: string) => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  clearCompleted: () => void
  updateSettings: (patch: Partial<AppSettings>) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  updateNotifications: (patch: Partial<NotificationPrefs>) => void
}

const TodoContext = createContext<TodoContextValue | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS)

  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    showCompletedInDashboard: true,
  })

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatarColor: '#c8622a',
  })

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    dueSoonAlerts: true,
    dailySummary: false,
    weeklyReport: true,
  })

  function addTodo(text: string, priority: Priority, category: Category, dueDate?: string) {
    setTodos(prev => [
      {
        id: Date.now(),
        text,
        completed: false,
        priority,
        category,
        createdAt: new Date(),
        dueDate,
      },
      ...prev,
    ])
  }

  function toggleTodo(id: number) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  function updateSettings(patch: Partial<AppSettings>) {
    setSettings(prev => ({ ...prev, ...patch }))
  }

  function updateProfile(patch: Partial<UserProfile>) {
    setProfile(prev => ({ ...prev, ...patch }))
  }

  function updateNotifications(patch: Partial<NotificationPrefs>) {
    setNotifications(prev => ({ ...prev, ...patch }))
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        settings,
        profile,
        notifications,
        addTodo,
        toggleTodo,
        deleteTodo,
        clearCompleted,
        updateSettings,
        updateProfile,
        updateNotifications,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodos must be used within TodoProvider')
  return ctx
}
