import { AUTH_SERVICE, HOME_URL, isExpiredToken } from "@gems/utils";
import { IAuthInfo, IUserInfo } from "@interface/auth.interface";
import { AuthService } from "@services/api/Auth.service";
import * as authHelper from "@services/helper/auth.helper";
import {
	disableSplashScreen,
	enableSplashScreen,
} from "@services/helper/splashScreen.helper";
import { axiosIns } from "config/api.config";
import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

type AuthContextProps = {
	isAuthenticated: boolean;
	saveAuth: (auth: IAuthInfo | null, cUser: IUserInfo | null) => void;
	currentUser: IUserInfo | null;
	setCurrentUser: Dispatch<SetStateAction<IUserInfo | null>>;
	logout: () => void;
};

const isValidToken = () => {
	const authInfo = authHelper.getAuth();
	if (!authInfo) return false;
	return !isExpiredToken(authInfo?.accessToken);
};

const initAuthContextPropsState = {
	isAuthenticated: false,
	saveAuth: () => {},
	currentUser: null,
	setCurrentUser: () => {},
	logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [isLoading, setLoading] = useState<boolean>(true);
	const [isAuthenticated, makeAuthenticated] = useState<boolean>(
		isValidToken()
	);
	const [currentUser, setCurrentUser] = useState<IUserInfo | null>(
		authHelper?.getUser()
	);

	// useEffect(() => {
	// 	!isAuthenticated &&
	// 		window.location.pathname !== HOME_URL &&
	// 		window.location.replace(HOME_URL);
	// }, [isAuthenticated]);

	useEffect(() => {
		const checker = setInterval(() => {
			const isValid = isValidToken();
			const refreshToken = authHelper.getAuth()?.refreshToken;
			if (!isValid && refreshToken) {
				AuthService.getNewToken(refreshToken)
					.then((resp) => {
						authHelper.setAuth(resp?.header, currentUser);
						makeAuthenticated(true);
					})
					.catch((err) => logout())
					.finally(() => setLoading(false));
			} else if (isValid && isLoading) setLoading(false);
			else if (!isValid && !refreshToken) logout();
		}, 30000);
		return () => clearInterval(checker);
	}, [currentUser, isLoading]);

	const saveAuth = (auth: IAuthInfo | null, cUser: IUserInfo | null) => {
		// setCurrentUser(cUser);
		// if (auth) {
		// 	authHelper.setAuth(auth, cUser);
		// 	makeAuthenticated(true);
		// } else {
		// 	authHelper.removeAuth();
		// 	makeAuthenticated(false);
		// }
	};

	const logout = () => {
		axiosIns.post(AUTH_SERVICE + "auth/sign-out").then((res) => {
			authHelper.removeAuth();
			makeAuthenticated(false);
			window.location.replace(HOME_URL);
		});
	};

	isLoading ? enableSplashScreen() : disableSplashScreen();

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, saveAuth, currentUser, setCurrentUser, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { AuthProvider, useAuth };
