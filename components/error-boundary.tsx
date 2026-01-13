"use client";

import React, { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches React errors and displays a graceful error UI with retry capability.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * // Or with custom fallback:
 * <ErrorBoundary fallback={(error, retry) => (
 *   <div>Custom error: {error.message} <button onClick={retry}>Retry</button></div>
 * )}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.resetError)
      ) : (
        <DefaultErrorFallback
          error={this.state.error}
          retry={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 */
function DefaultErrorFallback({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 mt-1 shrink-0" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-red-700 mb-4">
                {error.message || "An unexpected error occurred"}
              </p>
              <p className="text-xs text-red-600 mb-4 p-3 bg-red-100 rounded font-mono break-all">
                {error.stack?.split("\n")[0]}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={retry}
                  variant="outline"
                  size="sm"
                  className="border-red-300 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-100"
                >
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Async Error Fallback Component
 *
 * For handling errors from useData hook in components
 *
 * Usage:
 * ```tsx
 * const { data, loading, error, refetch } = useData();
 *
 * if (error) {
 *   return <AsyncErrorFallback error={error} retry={refetch} />;
 * }
 * ```
 */
export function AsyncErrorFallback({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                Failed to load data
              </h3>
              <p className="text-sm text-amber-700 mb-3">{error}</p>
              <Button
                onClick={retry}
                variant="outline"
                size="sm"
                className="border-amber-300 hover:bg-amber-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading State Component
 *
 * Displays a loading spinner while data is being fetched
 *
 * Usage:
 * ```tsx
 * const { data, loading } = useData();
 *
 * if (loading) {
 *   return <LoadingState />;
 * }
 * ```
 */
export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
