"use client";

import React from "react";
import { useData, EMSData } from "@/hooks/use-data";
import { Spinner } from "@/components/ui/spinner";

type DataLoaderProps = {
  children: (data: EMSData) => React.ReactNode;
  className?: string;
  loadingFallback?: React.ReactNode;
};

export function DataLoader({
  children,
  className,
  loadingFallback,
}: DataLoaderProps) {
  const { data, loading, error } = useData();

  if (loading || !data) {
    return (
      <div className={className ?? "flex items-center justify-center h-96"}>
        {loadingFallback ?? (
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children(data)}</>;
}

export default DataLoader;
