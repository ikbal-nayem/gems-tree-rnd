export const ENV = {
	env: import.meta.env.VITE_ENV_TYPE || '',
	gateway: import.meta.env.VITE_GATEWAY || '',
	googleAnalyticsTag: import.meta.env.VITE_GOOGLE_ANALYTICS || '',
	public_url: import.meta.env.VITE_PUBLIC_URL || '',
	initLoadTime: +import.meta.env.VITE_INIT_LOAD_TIME || 0,
};
