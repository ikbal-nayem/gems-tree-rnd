/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAuth } from "@context/Auth";
import { Icon, Thumb } from "@gems/components";
import {
  PROFILE_URL,
  SETTINGS_URL,
  makePreviewUrl,
  toAbsoluteUrl,
} from "@gems/utils";
import { FC } from "react";

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <Thumb
            label="user-img"
            className="me-5"
            imgSrc={
              currentUser?.imageUrl
                ? makePreviewUrl(currentUser?.imageUrl)
                : toAbsoluteUrl("/media/avatars/300-1.jpg")
            }
          />

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.nameBn}
            </div>
            {currentUser?.posting?.postDTO?.nameBn && (
              <div className="fw-bold text-muted fs-7">
                {currentUser?.posting?.postDTO?.nameBn}
              </div>
            )}
            {currentUser?.posting?.postDTO?.nameBn && (
              <div className="fw-bold text-muted fs-7">
                {currentUser?.posting?.postingOrganizationDto?.nameBn}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <a href={PROFILE_URL} className="menu-link px-5">
          <Icon icon="person" size={20} className="me-2" />
          প্রোফাইল
        </a>
      </div>

      <div className="menu-item px-5 my-1">
        <a href={SETTINGS_URL} className="menu-link px-5">
          <Icon icon="settings" size={20} className="me-2" />
          সেটিংস
        </a>
      </div>
      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          <Icon icon="logout" size={20} className="me-2" />
          বাহির
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
