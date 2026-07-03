import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
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
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4" style={{ minHeight: '100vh' }}>
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                An error occurred while loading this page. This might be due to corrupted data or a temporary issue.
              </p>
              {this.state.error && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-mono text-muted-foreground">
                    {this.state.error.message || "Unknown error"}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">Stack trace</summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-40">{this.state.error.stack}</pre>
                    </details>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => {
                  // Clear potentially corrupted localStorage data
                  try {
                    localStorage.removeItem("qoo.donations.v1");
                  } catch (e) {
                    console.error("Failed to clear localStorage:", e);
                  }
                  window.location.href = "/temple/donations";
                }} variant="default">
                  Reset & Go to Donations Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    try {
      return this.props.children;
    } catch (error) {
      // Catch any errors during render
      console.error("Error during render:", error);
      this.setState({
        hasError: true,
        error: error instanceof Error ? error : new Error(String(error)),
        errorInfo: null,
      });
      return null;
    }
  }
}

export default ErrorBoundary;
