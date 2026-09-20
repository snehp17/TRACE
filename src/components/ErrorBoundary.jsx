import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TRACE ErrorBoundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-archive-950 text-archive-100 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full p-8 rounded-3xl bg-archive-900 border border-amber-accent/40 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-accent/15 border border-amber-accent/30 flex items-center justify-center mx-auto text-amber-accent">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-editorial font-bold text-paper">Archive Continuity Protected</h2>
              <p className="text-xs text-archive-400 font-mono leading-relaxed">
                An isolated rendering error was intercepted safely by TRACE Reliability Sentinels. Your stored receipts remain safe.
              </p>
              {this.state.error && (
                <div className="p-3 rounded-lg bg-black/60 border border-rose-500/40 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                  <p className="font-bold">{this.state.error.name}: {this.state.error.message}</p>
                </div>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-accent hover:bg-amber-light text-archive-950 font-mono font-bold text-xs transition-all shadow-glow-amber cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restore Archive View</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
