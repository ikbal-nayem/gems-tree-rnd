import { AUTH_INFO, USER_INFO } from "@gems-web/utils";
import { IAuthInfo, IUserInfo } from "@interface/auth.interface";
import { LocalStorageService } from "@services/utils/localStorage.service";
import { setAuthHeader } from "config/api.config";

const getAuth = (): IAuthInfo => {
	if (!localStorage) {
		return;
	}

	const auth: IAuthInfo | null = LocalStorageService.get(AUTH_INFO);
	if (!auth) return;

	try {
		return { ...auth };
	} catch (error) {
		console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
	}
};

const getUser = (): IUserInfo => {
	if (!localStorage) {
		return;
	}

	const user: IUserInfo | null = LocalStorageService.get(USER_INFO);
	if (!user) return;

	try {
		return { ...user };
	} catch (error) {
		console.error("USER LOCAL STORAGE PARSE ERROR", error);
	}
};

const setAuth = (auth: IAuthInfo | null, user: IUserInfo | null) => {
	try {
		LocalStorageService.set(AUTH_INFO, auth);
		LocalStorageService.set(USER_INFO, user);
		setAuthHeader();
	} catch (error) {
		console.error("AUTH LOCAL STORAGE GET ERROR", error);
	}
};

const removeAuth = () => {
	if (!localStorage) return;

	try {
		localStorage.removeItem(AUTH_INFO);
		localStorage.removeItem(USER_INFO);
	} catch (error) {
		console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
	}
};

const deviceSignature = () => {
	const windowObj = window || global;

	// Count Browser window object keys
	const windowObjCount = () => {
		const keys = [];
		for (let i in windowObj) {
			keys.push(i);
		}
		return keys.length.toString(36);
	};
	// window obj and navigator aggregate
	const pad = (str, size) => {
		return (new Array(size + 1).join("0") + str).slice(-size);
	};

	// Browser mimiTypes and User Agent count
	const navi = (
		navigator.mimeTypes.length + navigator.userAgent.length
	).toString(36);
	const padString = pad(navi + windowObjCount(), 4);
	// Browser screen specific properties
	const width = windowObj.screen.width.toString(36);
	const height = windowObj.screen.height.toString(36);
	const availWidth = windowObj.screen.availWidth.toString(36);
	const availHeight = windowObj.screen.availHeight.toString(36);
	const colorDepth = windowObj.screen.colorDepth.toString(36);
	const pixelDepth = windowObj.screen.pixelDepth.toString(36);
	// Base64 encode
	return btoa(
		padString +
			width +
			height +
			availWidth +
			availHeight +
			colorDepth +
			pixelDepth
	);
};

export { getAuth, getUser, setAuth, removeAuth, deviceSignature };
