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
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card input-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <AlertTriangle size={36} color="#dc2626" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.5rem' }}>
            입력값 처리 중 일시적인 계산 오류가 발생했습니다.
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            입력된 수치를 확인 후 다시 시도해 주세요. ({this.state.error?.message || 'Calculation error'})
          </p>
          <button className="btn btn-primary" onClick={this.handleReset} style={{ margin: '0 auto' }}>
            <RefreshCw size={16} />
            <span>화면 복구 및 재시도</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
