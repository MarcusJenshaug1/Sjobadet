export const useRouter = () => ({
    push: () => undefined,
    replace: () => undefined,
    back: () => undefined,
    forward: () => undefined,
    refresh: () => undefined,
    prefetch: async () => undefined,
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});

export const RedirectType = {
    push: 'push',
    replace: 'replace',
} as const;

export const useSelectedLayoutSegment = () => null;
export const useSelectedLayoutSegments = () => [] as string[];
export const useServerInsertedHTML = (callback: () => void) => {
    callback();
    return null;
};

export const redirect = () => undefined;
export const permanentRedirect = () => undefined;
export const notFound = () => undefined;
export const forbidden = () => undefined;
export const unauthorized = () => undefined;

export const unstable_noStore = () => undefined;
export const unstable_cache = (fn) => fn;
export const unstable_cacheTag = () => undefined;
export const unstable_cacheLife = () => undefined;
export const unstable_cacheStore = () => undefined;
