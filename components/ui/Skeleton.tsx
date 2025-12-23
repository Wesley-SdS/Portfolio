"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'circular' | 'text' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = React.memo(({ 
  className, 
  variant = 'default',
  ...props 
}) => {
  const baseClasses = "animate-pulse bg-slate-700/50 rounded";
  
  const variantClasses = {
    default: "rounded",
    circular: "rounded-full",
    text: "h-4 rounded",
    card: "rounded-xl"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("glassmorphism rounded-xl p-6 space-y-4", className)}>
    <Skeleton variant="text" className="h-6 w-3/4" />
    <Skeleton variant="text" className="h-4 w-full" />
    <Skeleton variant="text" className="h-4 w-5/6" />
    <div className="flex gap-2 mt-4">
      <Skeleton variant="default" className="h-6 w-16 rounded-full" />
      <Skeleton variant="default" className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const SkeletonImage: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton variant="card" className={cn("aspect-video w-full", className)} />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        className={i === lines - 1 ? "w-5/6" : "w-full"} 
      />
    ))}
  </div>
);

