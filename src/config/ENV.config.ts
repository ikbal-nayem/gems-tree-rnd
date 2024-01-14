interface IENV {
	env: string;
	getway: string;
	googleAnalyticsTag: string;
	initLoadTime: any;
}

export const ENV: IENV = {
	env: process.env.REACT_APP_ENV_TYPE || '',
	getway: process.env.REACT_APP_GATEWAY || '',
	googleAnalyticsTag: process.env.REACT_APP_GOOGLE_ANALYTICS || '',
	initLoadTime: +process.env.REACT_APP_INIT_LOAD_TIME || 0,
};
