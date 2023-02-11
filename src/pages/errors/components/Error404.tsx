import { DASHBOARD } from "@constants/internal-route.constant";
import { toAbsoluteUrl } from "@gems-web/utils";
import { FC } from "react";
import { Link } from "react-router-dom";

const Error404: FC = () => {
	return (
		<div className="d-flex flex-column align-items-center justify-content-center">
			<h1 className="fw-bolder fs-2hx text-gray-900 mb-4">Oops!</h1>

			<div className="fw-semibold fs-6 text-gray-500 mb-7">
				We can't find that page.
			</div>

			<div className="mb-3">
				<img
					src={toAbsoluteUrl("/media/auth/404-error.svg")}
					className="mw-100 mh-300px theme-light-show"
					alt=""
				/>
				<img
					src={toAbsoluteUrl("/media/auth/404-error.svg")}
					className="mw-100 mh-300px theme-dark-show"
					alt=""
				/>
			</div>

			<div className="mt-5">
				<Link to={DASHBOARD} className="btn btn-sm btn-primary">
					Return Home
				</Link>
			</div>
		</div>
	);
};

export default Error404;
