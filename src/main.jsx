import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CollectionProvider from './CollectionProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CollectionProvider><App /></CollectionProvider>
  </StrictMode>,
)
