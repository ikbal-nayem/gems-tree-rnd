import { toast } from "@gems-web/components";
import { IAuthInfo } from "@interface/auth.interface";
// import { deviceSignature } from "@services/helper/auth.helper";
import { LocalStorageService } from "@services/utils/localStorage.service";
import axios from "axios";
import { ENV } from "./ENV.config";
import { AUTH_INFO, HOME_URL, getResponseStatusMessage } from "@gems-web/utils";

const axiosIns = axios.create({
	baseURL: ENV.getway,
	headers: {
		Accept: "application/json",
		// ds: deviceSignature(),
	},
});

const setAuthHeader = () => {
	const authInfo: IAuthInfo = LocalStorageService.get(AUTH_INFO) || null;
	if (authInfo)
		axiosIns.defaults.headers.common["Authorization"] =
			"Bearer " + authInfo?.accessToken;
};

setAuthHeader();

axiosIns.interceptors.request.use(
	(config) => config,
	(error) => {
		if (error.response) {
			return Promise.reject({
				...error.response,
				...{ status: error.response.status || error.status },
			});
		}

		return Promise.reject({
			body: false,
			status: 404,
			message: "Server not responding",
		});
	}
);

axiosIns.interceptors.response.use(
	(res: any) => {
		if (res?.status === 200 && res?.data?.status === 200)
			return { ...res.data };
		if (res?.status === 401 || res?.data?.status === 401) logout();

		return Promise.reject({
			body: res?.data?.body,
			status: res?.data?.status,
			message: res?.data?.message,
		});
	},
	(error) => {
		if (error?.response) {
			if (error.response?.status === 401) logout();
			if (error.response?.status === 413) {
				toast.error(getResponseStatusMessage(error.response?.status));
				return;
			}
			if (error.response?.data) {
				return Promise.reject({
					status: error.response?.status,
					message: error.response?.data?.message || error.response?.data?.error,
					body: {},
				});
			}

			return Promise.reject({
				message: error.message,
				status: error?.response?.status || error.status || 500,
			});
		} else
			return Promise.reject({
				status: 500,
				message: "Server not responding",
				body: {},
			});
	}
);

const logout = () => {
	LocalStorageService.clear();
	window.location.replace(HOME_URL);
};

export { axiosIns, setAuthHeader };
