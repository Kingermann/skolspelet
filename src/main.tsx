import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ingen StrictMode: i utvecklingsläge kör den effekter två gånger,
// vilket skulle spela fanfaren dubbelt.
createRoot(document.getElementById('root')!).render(<App />)
