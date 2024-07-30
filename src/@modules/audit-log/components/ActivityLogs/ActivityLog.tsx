// import ProfilePostingInfo from '@components/ProfileSummary/ProfilePostingInfo';
import { ACLWrapper, Card, Icon, NoData, Tag, Thumb } from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IColors,
  IObject,
  ROLES,
  generateDateFormat,
  makePreviewUrl,
  //   statusColorMapping,
} from "@gems/utils";
import "./activitiesLog.scss";
import { statusColorMapping } from "utility/colorMap";

const ActivitesLog = ({
  applicationComments,
  draftDate,
}: {
  applicationComments: IObject[];
  draftDate?: number;
}) => {
  const data = applicationComments || [];

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
                    {generateDateFormat(item?.acrTime, DATE_PATTERN.CASUAL)}
                  </span>
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <Icon icon="schedule" className="d-none d-sm-block" />
                    {generateDateFormat(
                      item?.acrTime,
                      "%hour%:%minute% %ampm%"
                    )}
                  </span>
                </div>
                <div className="timeline-activity-badge">
                  <Icon
                    icon="radio_button_checked"
                    color={
                      statusColorMapping(item?.acrShortStatusEn) as IColors
                    }
                    size={20}
                  />
                </div>
                <div className="ms-md-3 ms-2">
                  <Thumb
                    imgSrc={makePreviewUrl(
                      item?.employeeBasicInfoDTO?.imageUrl
                    )}
                    label={
                      item?.employeeBasicInfoDTO?.nameBn ||
                      COMMON_LABELS.NOT_ASSIGN
                    }
                  />
                </div>
                <div className="fw-normal timeline-content text-muted ps-3">
                  <p className="fw-bold text-gray-800 mb-1">
                    <Tag
                      title={item?.acrShortStatusBn}
                      color={
                        statusColorMapping(item?.acrShortStatusEn) as IColors
                      }
                    />
                  </p>

                  <p className="fw-bolder fs-6 text-gray-900 mb-0">
                    {item?.employeeBasicInfoDTO?.nameBn ||
                      COMMON_LABELS.NOT_ASSIGN}
                  </p>
                  <p className="fw-normal fs-7">
                    {item?.employeeBasicInfoDTO?.postNameBN || ""}
                    {item?.employeeBasicInfoDTO?.postNameBN &&
                    item?.employeeBasicInfoDTO?.orgNameBN
                      ? ", " + item?.employeeBasicInfoDTO?.orgNameBN
                      : item?.employeeBasicInfoDTO?.orgNameBN
                      ? item?.employeeBasicInfoDTO?.orgNameBN
                      : ""}
                  </p>
                  {/* <ProfilePostingInfo
                    posting={item?.employeeBasicInfoDTO?.postingDTO}
                    className="fw-normal fs-7"
                  /> */}
                  {/* <p>
                    <span className="fw-bold">মন্তব্য: </span>
                    {item?.remarks || COMMON_LABELS.NOT_ASSIGN}
                  </p> */}
                </div>
              </div>
            );
          })}
          {draftDate && (
            <ACLWrapper visibleToRoles={[ROLES.SUPER_ADMIN]}>
              <div className="timeline-item">
                <div className="timeline-label fw-bold text-gray-800">
                  <span className="d-flex gap-1 align-items-center">
                    <Icon icon="event" className="d-none d-sm-block" />
                    {generateDateFormat(draftDate, DATE_PATTERN.CASUAL)}
                  </span>
                  <span className="text-muted d-flex gap-1 align-items-center">
                    <Icon icon="schedule" className="d-none d-sm-block" />
                    {generateDateFormat(draftDate, "%hour%:%minute% %ampm%")}
                  </span>
                </div>
                <div className="timeline-activity-badge">
                  <Icon icon="radio_button_checked" size={20} />
                </div>
                <div className="fw-normal timeline-content text-muted ps-3">
                  <Tag title="খসড়া হয়েছে" color="light" variant="fill" />
                </div>
              </div>
            </ACLWrapper>
          )}
        </div>
      </div>
      {data?.length === 0 && <NoData details="কোনো কার্যক্রম পাওয়া যায়নি!" />}
    </>
  );
};

export { ActivitesLog };
