import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Separator } from "@gems/components";
import { IObject } from "@gems/utils";
import { isNotEmptyList } from "utility/utils";

interface IAttachedOrgList {
  data: IObject[];
  langEn: boolean;
  isTabContent?: boolean;
  title?: string;
}

const AttachedOrgList = ({
  data,
  langEn,
  isTabContent,
  title,
}: IAttachedOrgList) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const COMMON_LABEL = langEn ? COMMON_LABELS.EN : COMMON_LABELS;
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABEL.ATTACHED_OFFICE}
        </h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div className="row">
        {isNotEmptyList(data) &&
          data?.map((item, i) => {
            const orgType = item?.orgTypeDTO;
            const orgList = item?.organizationDTOList;
            return (
              <div className="col-md-6 col-12" key={i}>
                <p
                  className={
                    "fs-6 fw-bold mb-0" + (orgType ? "" : " fs-3 text-danger")
                  }
                >
                  {(langEn ? orgType?.titleEn : orgType?.titleBn) ||
                    COMMON_LABEL.NOT_ASSIGN}
                </p>
                <ol>
                  {isNotEmptyList(orgList) &&
                    orgList?.map((d, idx) => {
                      return (
                        <li key={idx}>
                          {" "}
                          <span
                            className={
                              isTabContent
                                ? d?.isModified
                                  ? "text-underline-color-purple"
                                  : d?.isAddition
                                  ? "text-decoration-underline"
                                  : d?.isDeleted
                                  ? "text-line-through-color-red"
                                  : ""
                                : ""
                            }
                          >
                            {" "}
                            {langEn ? d?.nameEn : d?.nameBn}{" "}
                          </span>
                        </li>
                      );
                    })}
                </ol>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AttachedOrgList;
