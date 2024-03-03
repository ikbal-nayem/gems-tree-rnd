import { useAuth } from "@context/Auth";
import clsx from "clsx";
import { useLayout } from "../../core";
// import HeaderModules from "./header-menus/HeaderModules";
// import { HeaderNotificationsMenu } from "./header-menus/HeaderNotificationsMenu";
import {
  HeaderModules,
  HeaderUserMenu,
  Icon,
  MenuWrapper,
  Thumb,
} from "@gems/components";
import { makePreviewUrl, toAbsoluteUrl } from "@gems/utils";
import ModuleIcon from "assets/svg/modules.svg?react";
// import { HeaderUserMenu } from "./header-menus/HeaderUserMenu";

const itemClass = "ms-1 ms-lg-3";
const btnClass =
  "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px";
const btnIconClass = "svg-icon-1";

const Navbar = () => {
  const { config } = useLayout();
  const { currentUser, logout } = useAuth();

  return (
    <div className="app-navbar flex-shrink-0">
      {/* <div className={clsx('app-navbar-item align-items-stretch', itemClass)}>
        <Search />
      </div> */}

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div id='kt_activities_toggle' className={btnClass}>
          <KTSVG path='/media/icons/duotune/general/gen032.svg' className={btnIconClass} />
        </div>
      </div> */}

      <MenuWrapper
        className={clsx("d-flex align-items-center", itemClass)}
        triggerClassName={btnClass}
        triggerContent={<ModuleIcon />}
        bodyClassName="w-250px w-lg-325px"
      >
        <HeaderModules />
      </MenuWrapper>

      {/* <div className={clsx("app-navbar-item", itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          className={btnClass}
        >
          <Icon
            icon="notifications_active"
            color="warning"
            className={`svg-icon ${btnIconClass}`}
            size={30}
          />
        </div>
        <HeaderNotificationsMenu />
      </div> */}

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div className={clsx('position-relative', btnClass)} id='kt_drawer_chat_toggle'>
          <KTSVG path='/media/icons/duotune/communication/com012.svg' className={btnIconClass} />
          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
        </div>
      </div> */}

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div> */}

      <div className={clsx("app-navbar-item", itemClass)}>
        <div
          className="cursor-pointer"
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <Thumb
            label="user-image"
            imgSrc={
              currentUser?.imageUrl
                ? makePreviewUrl(currentUser?.imageUrl)
                : toAbsoluteUrl("/media/avatars/blank.png")
            }
          />
        </div>
        <HeaderUserMenu currentUser={currentUser} logout={logout} />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div
          className="app-navbar-item d-lg-none ms-2 me-n3"
          title="Show header menu"
        >
          <div
            className="btn btn-icon btn-active-color-primary w-35px h-35px"
            id="kt_app_header_menu_toggle"
          >
            <Icon icon="format_align_left" size={25} className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  );
};

export { Navbar };
