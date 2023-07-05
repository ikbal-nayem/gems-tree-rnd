import { toAbsoluteUrl } from "@gems/utils";
import { FC } from "react";

type ServerMaintananceProps = {
	title?: string;
	details?: string;
	action?: any;
};

const ServerMaintanance: FC<ServerMaintananceProps> = ({
	title,
	details,
	action,
}) => {
	return (
		<div className="d-flex flex-column align-items-center justify-content-center">
			{title ? (
				<h1 className="fw-bolder fs-2hx text-gray-900 mb-4">{title}</h1>
			) : null}

			<div className="my-10 animate__animated animate__fadeIn">
				<img
					src={toAbsoluteUrl("/media/svg/under-development.svg")}
					className="mh-200px theme-light-show"
					alt="under-development"
				/>
				<img
					src={toAbsoluteUrl("/media/svg/under-development.svg")}
					className="mh-200px theme-dark-show"
					alt="under-development"
				/>
			</div>

			<div className="fw-semibold fs-4 text-gray-700 mb-7 animate__animated animate__bounceIn">
				{details || "সার্ভার মেইনটেন্যান্স এর কাজ চলতেছে!"}
			</div>

			{action ? <div className="mt-5">{action}</div> : null}
		</div>
	);
};

export default ServerMaintanance;
