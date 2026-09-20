import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ArchiveProvider } from './context/ArchiveContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ArchiveProvider>
        <App />
      </ArchiveProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
