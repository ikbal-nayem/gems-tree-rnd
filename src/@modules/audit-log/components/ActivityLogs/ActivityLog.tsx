// import ProfilePostingInfo from '@components/ProfileSummary/ProfilePostingInfo';
import { Icon, NoData, Tag, Thumb } from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IColors,
  IObject,
  generateDateFormat,
  makePreviewUrl,
} from "@gems/utils";
import { statusColorMapping } from "utility/colorMap";
import "./activitiesLog.scss";

interface IActivitesLog {
  data: IObject[];
}

const ActivitesLog = ({ data }: IActivitesLog) => {
  return (
    <>
      <div className="mt-5 activities-log">
        <div className="timeline-label">
          {data?.map((item, i) => {
            return (
              <div className="timeline-item" key={i}>
                <div className="timeline-label fw-bold text-gray-800">
                  <span className="d-flex gap-1 align-items-center">
                    <Icon icon="event" className="d-none d-sm-block" />
                    {generateDateFormat(item?.omsTime, DATE_PATTERN.CASUAL)}
                  </span>
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <Icon icon="schedule" className="d-none d-sm-block" />
                    {generateDateFormat(
                      item?.omsTime,
                      "%hour%:%minute% %ampm%"
                    )}
                  </span>
                </div>
                <div className="timeline-activity-badge">
                  <Icon
                    icon="radio_button_checked"
                    color={statusColorMapping(item?.statusEn) as IColors}
                    size={20}
                  />
                </div>
                <div className="ms-md-3 ms-2">
                  <Thumb
                    imgSrc={makePreviewUrl(item?.employeeDTO?.imageUrl)}
                    label={
                      item?.employeeDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN
                    }
                  />
                </div>
                <div className="fw-normal timeline-content text-muted ps-3">
                  <p className="fw-bold text-gray-800 mb-1">
                    <Tag
                      title={item?.statusBn}
                      color={statusColorMapping(item?.statusEn) as IColors}
                    />
                  </p>

                  <p className="fw-bolder fs-6 text-gray-800 mb-0">
                    {item?.employeeDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                  </p>
                  <p className="fw-normal fs-7 text-gray-800">
                    {item?.employeeDTO?.postDTO?.nameBn || ""}
                    {item?.employeeDTO?.postDTO?.nameBn &&
                    item?.employeeDTO?.organizationDTO?.nameBn
                      ? ", " + item?.employeeDTO?.organizationDTO?.nameBn
                      : item?.employeeDTO?.organizationDTO?.nameBn
                      ? item?.employeeDTO?.organizationDTO?.nameBn
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {data?.length === 0 && <NoData details="কোনো কার্যক্রম পাওয়া যায়নি!" />}
    </>
  );
};

export { ActivitesLog };
