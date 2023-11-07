import clsx from "clsx";

export const NewProposalMenu = () => {
  return (
    <div className={clsx("app-navbar-item")}>
      <div
        className="cursor-pointer"
        data-kt-menu-trigger="{default: 'click'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-start"
      >
        <span
          className={`nav-link text-active-primary cursor-pointer me-8 mt-2 fw-bold text-gray-700 fs-5`}
        >
          নতুন প্রস্তাব
        </span>
        <div
          className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-700 menu-state-bg menu-state-primary fw-bold py-2 fs-6 w-200px"
          data-kt-menu="true"
        >
          <div className="menu-item px-2">
            <div className="menu-link">পদ সৃজন</div>
          </div>

          <div className="menu-item px-2">
            <div className="menu-link">পদের মেয়াদ সংরক্ষণ</div>
          </div>
        </div>
      </div>
    </div>
  );
};
