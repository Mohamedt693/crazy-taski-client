// SuspenseWrapper.tsx
import { Suspense, type ReactNode } from "react";
import Loader from "../../components/ui/Loader";

export function withSuspense(Component: ReactNode) {
    return (
        <Suspense fallback={<Loader />}>
            {Component}
        </Suspense>
    );
}