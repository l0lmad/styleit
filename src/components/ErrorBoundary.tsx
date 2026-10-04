import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  error: Error | null;
  info: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', this.props.label || 'app', error, info.componentStack);
    this.setState({ info: info.componentStack || '' });
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
        <div className="mt-16 w-full max-w-2xl bg-white rounded-2xl border border-red-100 shadow-lg p-6" dir="ltr">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h1 className="font-bold text-gray-900 text-lg">
                {this.props.label ? `${this.props.label} crashed` : 'Something went wrong'}
              </h1>
              <p className="text-sm text-gray-500">نسخ الرسالة دي وابعتها للمطوّر</p>
            </div>
          </div>

          <pre className="bg-gray-900 text-green-300 text-xs p-4 rounded-xl overflow-auto whitespace-pre-wrap break-all" dir="ltr">
            {error.name}: {error.message}
            {info ? `\n${info.trim().split('\n').slice(0, 12).join('\n')}` : ''}
          </pre>

          <button
            onClick={() => this.setState({ error: null, info: '' })}
            className="mt-4 px-5 py-2.5 bg-pink-500 text-white rounded-xl font-bold text-sm hover:bg-pink-600 transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }
}