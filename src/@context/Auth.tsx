import { AUTH_SERVICE, HOME_URL, IUserInfo, isExpiredToken, isObjectNull } from '@gems/utils';
import { AuthService } from '@services/api/Auth.service';
import * as authHelper from '@services/helper/auth.helper';
import { disableSplashScreen, enableSplashScreen } from '@services/helper/splashScreen.helper';
import { axiosIns } from 'config/api.config';
import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

type AuthContextProps = {
	isAuthenticated: boolean;
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
	currentUser: null,
	setCurrentUser: () => {},
	logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [isLoading, setLoading] = useState<boolean>(true);
	const [isAuthenticated, makeAuthenticated] = useState<boolean>(isValidToken());
	const [currentUser, setCurrentUser] = useState<IUserInfo | null>(authHelper?.getUser());

	useEffect(() => {
		if (isObjectNull(currentUser)) logout();
		authChecker();
		const checker = setInterval(authChecker, 30000);
		return () => clearInterval(checker);
	}, []);

	const authChecker = () => {
		const isValid = isValidToken();
		const refreshToken = authHelper.getAuth()?.refreshToken;
		if (!isValid && refreshToken) {
			AuthService.getNewToken(refreshToken)
				.then((resp) => {
					authHelper.setAuth(resp?.header, currentUser);
					makeAuthenticated(true);
				})
				.catch((err) => logout());
		} else if (isValid && isLoading) setLoading(false);
		else if (!isValid && !refreshToken) logout();
	};

	const logout = () => {
		axiosIns.post(AUTH_SERVICE + 'auth/sign-out').then((res) => {
			authHelper.removeAuth();
			makeAuthenticated(false);
			window.location.replace(HOME_URL);
		});
	};

	isLoading ? enableSplashScreen() : disableSplashScreen();

	return (
		<AuthContext.Provider value={{ isAuthenticated, currentUser, setCurrentUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { AuthProvider, useAuth };
