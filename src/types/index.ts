export type Priority = 'low' | 'medium' | 'high'

export type Category = 'work' | 'personal' | 'shopping' | 'health'

export interface Todo {
  id: number
  text: string
  completed: boolean
  priority: Priority
  category: Category
  createdAt: Date
  dueDate?: string
}

export type FilterType = 'all' | 'active' | 'completed'

export type Page = 'dashboard' | 'tasks' | 'settings'

export interface UserProfile {
  name: string
  email: string
  avatarColor: string
}

export interface NotificationPrefs {
  dueSoonAlerts: boolean
  dailySummary: boolean
  weeklyReport: boolean
}
