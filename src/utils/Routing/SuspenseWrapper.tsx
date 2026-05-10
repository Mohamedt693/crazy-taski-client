// SuspenseWrapper.tsx
import { Suspense, type ReactNode } from "react";

export function withSuspense(Component: ReactNode) {
    return (
        <Suspense fallback={null}>
            {Component}
        </Suspense>
    );
}