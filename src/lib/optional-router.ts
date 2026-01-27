import { useRouter } from 'next/navigation';

export type AppRouterLike = {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (href: string) => Promise<void>;
};

const fallbackRouter: AppRouterLike = {
    push: () => undefined,
    replace: () => undefined,
    back: () => undefined,
    forward: () => undefined,
    refresh: () => undefined,
    prefetch: async () => undefined,
};

export function useOptionalRouter(): AppRouterLike {
    try {
        return useRouter() as unknown as AppRouterLike;
    } catch {
        return fallbackRouter;
    }
}
