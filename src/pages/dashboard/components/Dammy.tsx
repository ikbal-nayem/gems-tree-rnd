import { toAbsoluteUrl } from "@gems/utils";

const Landing = () => {
	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center"
			style={{ height: "80vh" }}
		>
			<img
				className="mx-auto mw-100 w-125px w-lg-150px mb-10 mb-lg-20 animate__animated animate__backInDown"
				src={toAbsoluteUrl("/media/auth/gov-logo.png")}
				alt="Govt. logo"
			/>
			<h1 className="animate__animated animate__fadeIn animate__delay-1s">
				ওএমএস-এ আপনাকে স্বাগত!
			</h1>
		</div>
	);
};

export default Landing;
