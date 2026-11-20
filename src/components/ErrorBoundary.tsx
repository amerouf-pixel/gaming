import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Une erreur inattendue est survenue.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('JITALX ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#120428] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#1b0838] border border-[#ff2a85]/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#ff2a85]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h1 className="font-hud font-bold text-lg uppercase tracking-wider text-white">
                Récupération JITALX
              </h1>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Une erreur d&apos;exécution a été interceptée afin de protéger vos données locales.
              Vous pouvez recharger l&apos;interface en toute sécurité.
            </p>
            <div className="p-3 bg-[#0e0320] border border-[#ff2a85]/25 text-xs font-mono-code text-slate-400 break-words max-h-32 overflow-y-auto">
              {this.state.errorMessage}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recharger JITALX</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
