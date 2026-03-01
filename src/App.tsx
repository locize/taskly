import { useState } from 'react'
import { TodoProvider } from './context/TodoContext'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import SettingsPage from './pages/SettingsPage'
import type { Page } from './types'
import styles from './App.module.css'

function AppLayout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <div className={styles.layout}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className={styles.main}>
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'tasks'     && <TasksPage />}
        {currentPage === 'settings'  && <SettingsPage />}
      </main>
    </div>
  )
}

function App() {
  return (
    <TodoProvider>
      <AppLayout />
    </TodoProvider>
  )
}

export default App

