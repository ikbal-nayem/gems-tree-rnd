import { LABELS } from "@constants/common.constant";
import {
  ITableHeadColumn,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";
import { FC } from "react";
import MpBlock from "./manpowerBlock";

type TableProps = {
  dataList: any[];
  isEnamCommittee: boolean;
  isTabContent?: boolean;
  title?: string;
};

const Manpower: FC<TableProps> = ({
  dataList,
  isEnamCommittee,
  isTabContent,
  title,
}) => {
  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 20, align: "center" },
    { title: "পদবি/স্তর", minWidth: 100 },
    { title: "পদের নাম ও সংখ্যা", minWidth: 150, align: "start" },
    // { title: "প্রস্তাবিত পদের নাম ও সংখ্যা", minWidth: 150, align: "center" },
    // { title: COMMON_LABELS.ACTION, align: "center" },
  ];

  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className={title ? "m-0 text-primary" : "m-0"}>
          {isTabContent && title ? title : LABELS.BN.SUM_OF_MANPOWER}
        </h4>
      </div>
      <Separator className="mt-1 mb-1" />
      {dataList?.length > 0 && (
        <Table columns={columns}>
          {dataList?.map((node, idx) => {
            // previousSameNode = null;
            // newNode = true;

            // previousSameNode = previousApprovedNodeWiseManpowerList.find(
            //   (n) =>
            //     n?.nodeTitleBn === node?.nodeTitleBn ||
            //     n?.nodeTitleEn === node?.nodeTitleEn
            // );
            // newNode = isObjectNull(previousSameNode);

            return (
              <TableRow key={idx}>
                <TableCell
                  verticalAlign="middle"
                  text={generateRowNumBn(idx)}
                />
                <TableCell
                  verticalAlign="middle"
                  text={
                    (isEnamCommittee ? node?.nodeTitleEn : node?.nodeTitleBn) ||
                    "-"
                  }
                  // tagText={node?.isAddition ? "নতুন" : null}
                  // tagColor="info"
                >
                  <span
                    className={`${
                      node?.isModified
                        ? "text-underline-color-yellow"
                        : node?.isAddition
                        ? "text-underline-color-black"
                        : node?.isDeleted
                        ? "text-line-through-color-red"
                        : ""
                    }`}
                  >
                    {(isEnamCommittee
                      ? node?.nodeTitleEn
                      : node?.nodeTitleBn) || "-"}
                  </span>
                </TableCell>
                {/* <TableCell>
                  <MpBlock
                    nodeData={previousSameNode}
                    isEnamCommittee={isEnamCommittee}
                    color=""
                  />
                </TableCell> */}
                <TableCell>
                  <MpBlock
                    nodeData={node}
                    isEnamCommittee={isEnamCommittee}
                    color=""
                  />
                </TableCell>
                {/* <TableCell textAlign="end" verticalAlign="middle">
                  <Dropdown
                    btnIcon={true}
                    btnContent={<Icon icon="more_vert" size={20} />}
                    id={node?.id}
                  >
                    <DropdownItem onClick={() => null}>
                      <Icon size={19} icon="edit" />
                      <h6 className="mb-0 ms-2">পরিবর্তন প্রস্তাব করুন</h6>
                    </DropdownItem>
                    <DropdownItem onClick={() => null}>
                      <Icon size={19} icon="delete" color="danger" />
                      <h6 className="mb-0 ms-2 text-danger">মুছে ফেলুন</h6>
                    </DropdownItem>
                  </Dropdown>
                </TableCell> */}
              </TableRow>
            );
          })}
        </Table>
      )}
    </div>
  );
};

export default Manpower;
