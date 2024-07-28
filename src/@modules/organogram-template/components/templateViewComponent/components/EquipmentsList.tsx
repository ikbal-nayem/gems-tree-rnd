import { COMMON_LABELS, LABELS } from "@constants/common.constant";
import { Icon, Separator, TextEditorPreview } from "@gems/components";
import { IObject, numEnToBn } from "@gems/utils";
import { useState } from "react";
import { isNotEmptyList } from "utility/utils";
import EquipmentsListChanges from "./EquipmentsListChanges";

interface IEquipmentsForm {
  data: IObject[];
  inventoryData: IObject[];
  othersData?: IObject;
  langEn: boolean;
  isBeginningVersion?: boolean;
  organogramId?: string;
  insideModal?: boolean;
  title?: string;
}

const EquipmentsForm = ({
  data,
  inventoryData,
  othersData,
  langEn,
  isBeginningVersion,
  organogramId,
  insideModal,
  title,
}: IEquipmentsForm) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => setIsOpen(false);

  return (
    <>
      <div className="card border p-3">
        <div className="card-head d-flex justify-content-between align-items-center">
          <h4 className={title ? "m-0 text-info" : "m-0"}>
            {title ? title : LABEL.EQUIPMENTS}
          </h4>
          {!othersData?.isInventoryOthers &&
            organogramId &&
            !isBeginningVersion &&
            !insideModal && (
              <Icon
                icon="swap_horiz"
                variants="outlined"
                hoverTitle={LABEL.CHANGES}
                size={25}
                className="text-primary text-hover-warning"
                onClick={() => setIsOpen(true)}
              />
            )}
        </div>
        <Separator className="mt-1 mb-1" />
        {othersData?.isInventoryOthers ? (
          <TextEditorPreview html={othersData?.inventoryOthersObject || ""} />
        ) : (
          <div className="row">
            {isNotEmptyList(inventoryData) &&
              inventoryData?.map((item, i) => {
                return (
                  <div className="col-md-6 col-12" key={i}>
                    <span className="fs-5 fw-bold">
                      {langEn ? i + 1 + ". " : numEnToBn(i + 1 + ". ")}
                    </span>
                    <u className="fs-5 fw-bold mb-0">
                      {langEn ? item?.inventoryTypeEn : item?.inventoryTypeBn}
                    </u>
                    <ol type="a">
                      {item?.itemList.map((d, idx) => {
                        return (
                          <li key={idx}>
                            {langEn ? d?.quantity : numEnToBn(d?.quantity)} x{" "}
                            {langEn ? d?.itemTitleEn : d?.itemTitleBn}{" "}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
          </div>
        )}

        {data?.length > 0 && (
          <>
            <div className="card-head d-flex justify-content-start align-items-center gap-2">
              <span className="fs-5 fw-bold">
                {langEn
                  ? inventoryData?.length + 1 + ". "
                  : numEnToBn(inventoryData?.length + 1 + ". ")}
              </span>
              <u className="fs-5 fw-bold m-0">{LABEL.MISCELLANEOUS}</u>
            </div>
            <Separator className="mt-1 mb-2" />
          </>
        )}

        <div>
          <ol type="a" className={langEn ? "mb-0" : "bn_ol mb-0"}>
            {data?.length > 0 &&
              data?.map((item, i) => {
                return (
                  <li key={i}>
                    {langEn
                      ? item?.titleEn || COMMON_LABELS.NOT_ASSIGN
                      : item?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
      <EquipmentsListChanges
        langEn={langEn}
        isOpen={isOpen}
        onClose={onClose}
        currentEquipmentsData={{
          data: data || [],
          inventoryData: inventoryData || [],
        }}
        organogramId={organogramId}
      />
    </>
  );
};

export default EquipmentsForm;
