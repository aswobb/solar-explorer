import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { LocaleProvider } from './locales/LocaleProvider'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Application root element is missing')
createRoot(root).render(<StrictMode><LocaleProvider><App /></LocaleProvider></StrictMode>)
