interface IENV {
	env: string;
	getway: string;
	googleAnalyticsTag: string;
}

export const ENV: IENV = {
	env: process.env.REACT_APP_ENV_TYPE || "",
	getway: process.env.REACT_APP_GETWAY || "",
	googleAnalyticsTag: process.env.REACT_APP_GOOGLE_ANALYTICS || "",
};
