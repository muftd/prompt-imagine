import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到控制台
    console.error('Error Boundary 捕获到错误:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // 刷新页面
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <Card className="max-w-2xl w-full p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  应用遇到了问题
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  我们很抱歉，应用发生了意外错误
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-foreground/80 mb-2">
                  错误详情：
                </p>
                <p className="text-sm font-mono text-destructive">
                  {this.state.error?.toString()}
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="p-4 bg-muted/30 rounded-lg">
                  <summary className="text-sm font-medium text-foreground/80 cursor-pointer">
                    开发者信息（仅开发环境显示）
                  </summary>
                  <pre className="mt-3 text-xs font-mono text-foreground/60 overflow-auto max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新页面
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="lg"
              >
                返回首页
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              如果问题持续存在，请尝试清除浏览器缓存后重新访问
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
