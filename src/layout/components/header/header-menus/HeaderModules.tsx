/* eslint-disable jsx-a11y/anchor-is-valid */
import ACLWrapper from "@acl/ACLWrapper";
import { FC } from "react";
import { HOME_URL, moduleList, toAbsoluteUrl } from "@gems/utils";
import { Icon } from "@gems/components";

const HeaderModules: FC = () => {
	return (
		<div className="menu-column">
			<div
				className="d-flex flex-column flex-center bgi-no-repeat rounded-top px-9 py-5"
				style={{
					backgroundImage: `url(${toAbsoluteUrl("/media/auth/auth-bg.png")})`,
				}}
			>
				<h3 className="text-white fw-bold mb-3">Modules</h3>
				<span className="badge bg-primary py-2 px-3">
					Total modules {moduleList?.length || 0}
				</span>
			</div>

			<div className="row g-0">
				{moduleList?.map((mo) => (
					<ACLWrapper visibleToRoles={mo.visibleTo || []} key={mo?.name}>
						<div className="col-6 col-md-4">
							<a
								href={mo?.url}
								className="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end border-bottom"
							>
								<Icon icon={mo?.icon} size={35} />
								<span className="fs-5 fw-bold text-gray-800 mb-0 mt-3">
									{mo?.name}
								</span>
							</a>
						</div>
					</ACLWrapper>
				))}
			</div>

			<div className="py-2 text-center border-top">
				<a
					href={HOME_URL}
					className="btn btn-color-gray-600 btn-active-color-primary d-flex align-items-center justify-content-center gap-3"
				>
					View All <Icon icon="double_arrow" color="primary" size={20} />
				</a>
			</div>
		</div>
	);
};

export default HeaderModules;
