import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorFallback extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-dark-800 border border-white/10 rounded-[5px] p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500 w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white tracking-tighter">Something went wrong</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                We've encountered an unexpected error. Our team has been notified.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-black/40 rounded-[5px] p-4 text-left overflow-auto max-h-40 border border-white/5">
                <code className="text-[10px] text-red-400 font-mono break-all">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-white py-3 rounded-[5px] font-bold transition-all text-sm tracking-widest"
              >
                <RefreshCw size={16} />
                Reload
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-[5px] font-bold transition-all text-sm tracking-widest shadow-lg shadow-brand-600/20"
              >
                <Home size={16} />
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
