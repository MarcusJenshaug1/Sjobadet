export const getRedirectError = () => new Error('Redirects are disabled in Storybook');
export const isRedirectError = () => false;
export const redirect = () => undefined;
export const permanentRedirect = () => undefined;
