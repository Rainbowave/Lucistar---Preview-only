
import React, { Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes('Failed to fetch dynamically imported module') || 
        error.message.includes('Importing a module script failed')) {
      console.warn("Chunk load error detected, reloading page...");
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
          <p>Please wait, updating application...</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');

if (!container) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
