import {
  Button,
  ITableHeadColumn,
  Modal,
  ModalBody,
  ModalFooter,
  NoData,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import {
  COMMON_LABELS,
  generateRowNumBn,
  IObject,
  numEnToBn,
} from "@gems/utils";
import { FC } from "react";

type TableProps = {
  isEn: boolean;
  dataList: IObject[];
  isOpen: boolean;
  onClose: () => void;
};

const ManPowerDetails: FC<TableProps> = ({
  dataList,
  isEn,
  isOpen,
  onClose,
}) => {
  const COMMON_LABEL = isEn ? COMMON_LABELS.EN : COMMON_LABELS;
  const columns: ITableHeadColumn[] = [
    { title: isEn ? "SL NO" : "ক্রমিক", width: 100 },
    { title: isEn ? "Post" : "পদবি", width: 250 },
    { title: isEn ? "Grade" : "গ্রেড", width: 150 },
    { title: isEn ? "Class" : "শ্রেণি", width: 150 },
    { title: isEn ? "Service Type" : "সার্ভিসের ধরন", width: 150 },
    { title: isEn ? "No of Employees" : "জনবল সংখ্যা", width: 200 },
    { title: isEn ? "Post Type" : "পদের ধরন", width: 150 },
  ];

  return (
    <Modal
      title={isEn ? "ManPower" : "জনবল"}
      isOpen={isOpen}
      handleClose={onClose}
      holdOn
      size="lg"
    >
      <ModalBody>
        <div className="p-2">
          {dataList?.length ? (
            <Table columns={columns}>
              {dataList.map((item, idx) => (
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
                  />
                  <TableCell
                    text={
                      item?.classKeyDto
                        ? isEn
                          ? item.classKeyDto.titleEn
                          : item.classKeyDto.titleBn
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                  />
                  <TableCell
                    text={
                      item?.serviceTypeDto
                        ? isEn
                          ? item.serviceTypeDto.titleEn
                          : item.serviceTypeDto.titleBn
                        : COMMON_LABEL.NOT_ASSIGN
                    }
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
                  <TableCell
                    text={
                      item?.postType
                        ? isEn
                          ? item.postType
                          : item.postType === "Permanent"
                          ? "স্থায়ী"
                          : "অস্থায়ী"
                        : COMMON_LABEL.NOT_ASSIGN
                    }
                  />
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
