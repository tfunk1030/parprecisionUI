'use client'

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

export default function ErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode,
  fallback: React.ReactNode 
}) {
  return (
    <ReactErrorBoundary fallbackRender={() => fallback}>
      {children}
    </ReactErrorBoundary>
  )
}
