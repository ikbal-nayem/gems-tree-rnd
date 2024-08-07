import {
  Button,
  ITableHeadColumn,
  Modal,
  ModalBody,
  ModalFooter,
  NoData,
  Separator,
  Table,
  TableCell,
  TableRow,
  Tag,
} from "@gems/components";
import {
  COMMON_LABELS,
  generateRowNumBn,
  IObject,
  isListNull,
  isObjectNull,
  numEnToBn,
} from "@gems/utils";
import { FC } from "react";

type TableProps = {
  isEn: boolean;
  data: IObject;
  isOpen: boolean;
  onClose: () => void;
};

const ManPowerDetails: FC<TableProps> = ({ data, isEn, isOpen, onClose }) => {
  const COMMON_LABEL = isEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const columns: ITableHeadColumn[] = [
    { title: isEn ? "SL NO" : "ক্রমিক", width: 100 },
    { title: isEn ? "Post" : "পদবি", width: 250 },
    { title: isEn ? "Grade" : "গ্রেড", width: 150, align: "center" },
    { title: isEn ? "Class" : "শ্রেণি", width: 150, align: "center" },
    {
      title: isEn ? "Service Type" : "সার্ভিসের ধরন",
      width: 150,
      align: "center",
    },
    {
      title: isEn ? "No of Employees" : "জনবল সংখ্যা",
      width: 200,
      align: "center",
    },
    { title: isEn ? "Post Type" : "পদের ধরন", width: 150, align: "center" },
  ];

  const postTypeList = [
    {
      titleEn: "Proposed",
      key: "proposed",
      titleBn: "প্রস্তাবিত",
    },
    {
      titleEn: "Permanent",
      key: "permanent",
      titleBn: "স্থায়ী",
    },
    {
      titleEn: "Non Permanent",
      key: "nonPermanent",
      titleBn: "অস্থায়ী",
    },
  ];

  const getPostTypeTitle = (key: string, isEn: boolean) => {
    let notAssign = isEn ? "Not Assigned" : COMMON_LABELS.NOT_ASSIGN;
    if (key) {
      const postType = postTypeList.find((item) => item.key === key);
      if (!isObjectNull(postType)) {
        return isEn ? postType.titleEn : postType.titleBn;
      } else return notAssign;
    }
    return notAssign;
  };

  return (
    <Modal
      title={isEn ? "Node Details" : "পদ/স্তরের বিস্তারিত"}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <ModalBody>
        <div className="p-2">
          <div>
            {data?.isSubOrgm ? (
              <div className="p-1 border rounded my-3">
                <p className="fs-5 mb-0 fw-bolder">
                  {isEn ? "Sub-Organogram" : "সাব-অর্গানোগ্রাম"}
                </p>
                <Separator className="mt-1 mb-2" />
                {!isObjectNull(data?.subOrgmOrgOrGroup)
                  ? data?.subOrgmOrgOrGroupName === "ORGANIZATIONS"
                    ? !isListNull(data?.subOrgmOrgOrGroup?.orgList) && (
                        <div>
                          {isEn ? "Organizations" : "প্রতিষ্ঠানসমূহ"}:{" "}
                          {data?.subOrgmOrgOrGroup?.orgList?.map((org) => (
                            <Tag
                              title={isEn ? org?.nameEn : org?.nameBn}
                              className="me-2 my-1"
                              color="dark"
                            />
                          ))}
                        </div>
                      )
                    : !isObjectNull(data?.subOrgmOrgOrGroup?.orgGroup) && (
                        <div>
                          {isEn ? "Organization Group" : "প্রতিষ্ঠানের গ্ৰুপ"}:{" "}
                          <Tag
                            title={
                              isEn
                                ? data?.subOrgmOrgOrGroup?.orgGroup?.nameEn
                                : data?.subOrgmOrgOrGroup?.orgGroup?.nameBn
                            }
                            className="me-2 my-1"
                            color="dark"
                          />
                        </div>
                      )
                  : COMMON_LABELS.NOT_ASSIGN}
              </div>
            ) : null}
          </div>
          {data?.manpowerList?.length > 0 ? (
            <Table columns={columns}>
              {data?.manpowerList?.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell
                    text={isEn ? (idx + 1).toString() : generateRowNumBn(idx)}
                    verticalAlign="top"
                  />
                  <TableCell
                    text={
                      item?.postDTO
                        ? `${isEn ? item.postDTO.nameEn : item.postDTO.nameBn}${
                            item.alternativePostListDTO?.length
                              ? ` / ${item.alternativePostListDTO
                                  .map((ap) => (isEn ? ap.nameEn : ap.nameBn))
                                  .join(" / ")}`
                              : ""
                          }`
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                  />
                  <TableCell
                    text={
                      item?.gradeDTO
                        ? isEn
                          ? item.gradeDTO.nameEn
                          : item.gradeDTO.nameBn
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                    textAlign="center"
                  />
                  <TableCell
                    text={
                      item?.classKeyDto
                        ? isEn
                          ? item.classKeyDto.titleEn
                          : item.classKeyDto.titleBn
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                    textAlign="center"
                  />
                  <TableCell
                    text={
                      item?.serviceTypeDto
                        ? isEn
                          ? item.serviceTypeDto.titleEn
                          : item.serviceTypeDto.titleBn
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                    textAlign="center"
                  />
                  <TableCell
                    text={
                      item?.numberOfEmployee
                        ? isEn
                          ? item.numberOfEmployee.toString()
                          : numEnToBn(item.numberOfEmployee)
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                    textAlign="center"
                  />
                  <TableCell className="remove-padding text-center">
                    {getPostTypeTitle(item?.postType, isEn)}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <NoData
              details={
                isEn
                  ? "No template data found!"
                  : "কোনো টেমপ্লেটের তথ্য পাওয়া যায়নি!"
              }
            />
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="d-flex gap-3 justify-content-end">
          <Button color="secondary" onClick={onClose}>
            {isEn ? "Close" : "বন্ধ করুন"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ManPowerDetails;
