# Taskly

A modern TODO app built with **Vite + React + TypeScript**.  
Used as the starting point for the i18next internationalization tutorial.

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── main.tsx
├── App.tsx                       # Root layout (sidebar + page routing)
├── App.module.css
├── index.css                     # Global styles & CSS variables
├── types/
│   └── index.ts                  # Todo, Priority, Category, Page, etc.
├── context/
│   └── TodoContext.tsx           # Global state: todos, profile, settings, notifications
├── components/
│   ├── Sidebar.tsx               # Nav sidebar with profile avatar & progress
│   └── Sidebar.module.css
└── pages/
    ├── DashboardPage.tsx         # Overview: stats, due soon, category progress
    ├── DashboardPage.module.css
    ├── TasksPage.tsx             # Full task list with filters & add form
    ├── TasksPage.module.css
    ├── SettingsPage.tsx          # Profile editor, language, notifications
    └── SettingsPage.module.css
```

## Features

- **3 pages**: Dashboard, Tasks, Settings
- **Dashboard**: personalised greeting, stats grid, due-soon list, category progress bars, recently completed
- **Tasks**: add tasks with priority + category + due date; filter by status & category; clear completed
- **Settings**: editable user profile, avatar color picker, language selector (ready for i18next), notification toggles, dashboard preferences

## Strings to translate (i18next step)

All hardcoded UI strings are plain text — no abstraction. Here's a tour of the interesting ones:

### Interpolation examples
```tsx
// DashboardPage.tsx
`{greeting}, {firstName}!`               // → t('greeting', { name: firstName })
`You have ${activeTasks} tasks left…`    // → uses count for plural
`${STREAK_DAYS} day streak`              // → t('streak', { count: STREAK_DAYS })
```

### Pluralization examples
```tsx
// DashboardPage.tsx
activeTasks === 1 ? '1 task' : `${activeTasks} tasks`

// TasksPage.tsx
`${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`
`Clear ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}`

// Sidebar.tsx
`${completedCount}/${totalCount} ${totalCount === 1 ? 'task' : 'tasks'}`
```

### Relative date strings
```tsx
// DashboardPage.tsx & TasksPage.tsx
'Overdue' | 'Today' | 'Tomorrow' | `In ${diff} days`
'Due today' | 'Due tomorrow' | `Due ${formatted}`
```

### Settings strings
Language names, notification descriptions, toggle labels, profile field labels — all in `SettingsPage.tsx`.
