import { AUTH_SERVICE } from "@gems-web/utils";
import { axiosIns } from "config/api.config";

export const AuthService = {
	login: async (payload): Promise<any> =>
		await axiosIns.post(AUTH_SERVICE + "auth/public/sign-in", payload),

	getNewToken: async (token): Promise<any> =>
		await axiosIns.get(AUTH_SERVICE + "auth/refresh-token", {
			headers: { Authorization: "Bearer " + token },
		}),

	getUserInfo: async (id): Promise<any> =>
		await axiosIns.get(AUTH_SERVICE + "users/get-details/" + id),

	// signOut: async (payload): Promise<any> => await axiosIns.post('admin-service/sign-out', payload),
};
