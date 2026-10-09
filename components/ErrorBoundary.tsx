import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/home';
  };

  public render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
                           this.state.error?.message?.includes('dynamically imported module') ||
                           this.state.error?.message?.includes('Loading chunk');

      return (
        <div className="min-h-screen bg-[#0d0f12] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#161a22] border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
              <AlertCircle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase tracking-tight">
                {isChunkError ? 'Application Update Available' : 'Something Went Wrong'}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {isChunkError
                  ? 'A new version of the app was deployed. Please reload the page to load the latest components.'
                  : (this.state.error?.message || 'An unexpected application error occurred.')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-white text-black py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]"
              >
                <RefreshCw size={16} /> Reload App
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                <Home size={16} /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
