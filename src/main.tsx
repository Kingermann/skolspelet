import { createRoot } from 'react-dom/client'
// Typsnittet ligger i appen själv – inga anrop till Google när barnet spelar.
import '@fontsource/fredoka/400.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/fredoka/700.css'
import './index.css'
import App from './App.tsx'

// Ingen StrictMode: i utvecklingsläge kör den effekter två gånger,
// vilket skulle spela fanfaren dubbelt.
createRoot(document.getElementById('root')!).render(<App />)
