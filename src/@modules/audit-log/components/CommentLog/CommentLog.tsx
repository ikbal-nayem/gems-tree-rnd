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
import "../ActivityLogs/activitiesLog.scss";

interface ICommentLog {
  CommentData: IObject[];
}

const CommentLog = ({ CommentData }: ICommentLog) => {
  return (
    <>
      <div className="mt-5 activities-log border p-3 rounded">
        <h4 className="activities-title border-bottom pb-2 mb-3">
          পর্যালোচনা ও অনুমোদন ক্ষেত্রে মন্তব্য সমূহ
        </h4>
        <div className="timeline-label-wrapper">
          <div className="timeline-label">
            {CommentData?.map((item, i) => {
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
                    <p className="fw-bold text-gray-800">
                      <Tag
                        title={item?.statusBn}
                        color={statusColorMapping(item?.statusEn) as IColors}
                        className="text-wrap"
                      />
                    </p>

                    <p className="fw-bolder fs-6 text-gray-800 mb-0">
                      {item?.employeeDTO?.nameBn || COMMON_LABELS.NOT_ASSIGN}
                    </p>

                    <p className="fw-light fs-7 text-gray-800 mb-0">
                      {item?.employeeDTO?.organizationDTO?.nameBn
                        ? item?.employeeDTO?.organizationDTO?.nameBn
                        : ""}
                    </p>
                    <p className="fw-normal fs-7 text-gray-800 fw-bold">
                      মন্তব্য :- &nbsp;{item?.reason || ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {CommentData?.length === 0 && (
        <NoData details="কোনো কার্যক্রম পাওয়া যায়নি!" />
      )}
    </>
  );
};

export { CommentLog };
