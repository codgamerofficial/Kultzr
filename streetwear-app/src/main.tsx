import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E1E20',
            color: '#F5F5F5',
            border: '1px solid #2A2A2A',
          },
          success: {
            iconTheme: {
              primary: '#A4FF00',
              secondary: '#0B0B0D',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF3B3B',
              secondary: '#0B0B0D',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)