/* eslint-disable react-hooks/exhaustive-deps */
import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export interface IPageLink {
	title: string;
	path: string;
	isActive: boolean;
	isSeparator?: boolean;
}

export interface IPageDataContextModel {
	pageTitle?: string;
	setPageTitle: (_title: string) => void;
	pageDescription?: string;
	setPageDescription: (_description: string) => void;
	pageBreadcrumbs?: Array<IPageLink>;
	setPageBreadcrumbs: (_breadcrumbs: Array<IPageLink>) => void;
	hasBack?: boolean;
	setHasBack?: (_val: boolean) => void;
	backLink?: string | (() => void);
	setBackLink?: (_val: string | (() => void)) => void;
	rightContent?: ReactNode | null;
	setRightContent?: (_reactNode: ReactNode) => void;
}

const PageDataContext = createContext<IPageDataContextModel>({
	setPageTitle: (_title: string) => {},
	setPageBreadcrumbs: (_breadcrumbs: Array<IPageLink>) => {},
	setPageDescription: (_description: string) => {},
});

const PageDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [pageTitle, setPageTitle] = useState<string>("");
	const [pageDescription, setPageDescription] = useState<string>("");
	const [pageBreadcrumbs, setPageBreadcrumbs] = useState<Array<IPageLink>>([]);
	const [hasBack, setHasBack] = useState<boolean>(false);
	const [backLink, setBackLink] = useState<string | (() => void)>();
	const [rightContent, setRightContent] = useState<ReactNode | null>();

	const value: IPageDataContextModel = {
		pageTitle,
		setPageTitle,
		pageDescription,
		setPageDescription,
		pageBreadcrumbs,
		setPageBreadcrumbs,
		hasBack,
		setHasBack,
		backLink,
		setBackLink,
		rightContent,
		setRightContent,
	};
	return (
		<PageDataContext.Provider value={value}>
			{children}
		</PageDataContext.Provider>
	);
};

function usePageData() {
	return useContext(PageDataContext);
}

type Props = {
	children?: ReactNode;
	description?: string;
	breadcrumbs?: Array<IPageLink>;
	hasBack?: boolean;
	backLink?: (() => void) | string;
};

const PageTitle: FC<Props> = ({
	children,
	description,
	breadcrumbs,
	hasBack,
	backLink,
}) => {
	const {
		setPageTitle,
		setPageDescription,
		setPageBreadcrumbs,
		setHasBack,
		setBackLink,
	} = usePageData();
	useEffect(() => {
		if (children) {
			setPageTitle(children as string);
		}
		return () => setPageTitle("");
	}, [children]);

	useEffect(() => {
		if (description) {
			setPageDescription(description);
		}
		return () => setPageDescription("");
	}, [description]);

	useEffect(() => {
		if (breadcrumbs) {
			setPageBreadcrumbs(breadcrumbs);
		}
		return () => setPageBreadcrumbs([]);
	}, [breadcrumbs]);

	useEffect(() => {
		if (hasBack) {
			setHasBack(!!hasBack);
		}
		return () => setHasBack(false);
	}, [hasBack]);

	useEffect(() => {
		if (backLink) {
			setBackLink(backLink);
		}
		return () => setBackLink("");
	}, [backLink]);

	return <></>;
};

const PageDescription: FC<{ children: ReactNode }> = ({ children }) => {
	const { setPageDescription } = usePageData();
	useEffect(() => {
		if (children) {
			setPageDescription(children.toString());
		}
		return () => setPageDescription("");
	}, [children]);
	return <></>;
};

const PageToolbarRight: FC<{ children: ReactNode }> = ({ children }) => {
	const { setRightContent } = usePageData();
	useEffect(() => {
		if (children) {
			setRightContent(children);
		}
		return () => setRightContent(null);
	}, [children]);
	return <></>;
};

export {
	PageDescription,
	PageTitle,
	PageDataProvider,
	usePageData,
	PageToolbarRight,
};
