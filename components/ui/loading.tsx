"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinner";

type LoadingProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingProps) {
  return (
    <div className={className ?? "flex items-center justify-center h-96"}>
      <div className="text-center">
        <Spinner className="w-12 h-12 mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export default LoadingState;
