import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  NoData,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";
import { FC } from "react";
import MpNode from "./mpNode";

type TableProps = {
  dataList: any[];
  isEnamCommittee: boolean;
};

const ManpowerRequest: FC<TableProps> = ({ dataList, isEnamCommittee }) => {
  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 20, align: "center" },
    { title: "পদবি/স্তর", width: 145 },
    { title: "পদের নাম ও সংখ্যা", width: 145, align: "center" },
    // { title: "প্রস্তাবিত পদ  ও সংখ্যা", width: 145, align: "center" },
    { title: COMMON_LABELS.ACTION, width: 145, align: "center" },
  ];

  // console.log(dataList);

  return (
    <div className="card p-5">
      <Table columns={columns}>
        {dataList?.length ? (
          dataList?.map((node, idx) => (
            <TableRow key={idx}>
              <TableCell verticalAlign="middle" text={generateRowNumBn(idx)} />
              <TableCell
                text={
                  (isEnamCommittee ? node?.nodeTitleEn : node?.nodeTitleBn) ||
                  "-"
                }
              />
              <TableCell>
                <MpNode nodeData={node} isEnamCommittee={isEnamCommittee} />
              </TableCell>
              <TableCell textAlign="end" verticalAlign="top">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={node?.id}
                >
                  <DropdownItem onClick={() => null}>
                    {/* <Icon size={19} icon="visibility" /> */}
                    {/* <h6 className="mb-0 ms-3">দেখুন</h6> */}
                  </DropdownItem>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3}>
              <NoData details="কোনো তথ্য পাওয়া যায়নি!" />
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
};

export default ManpowerRequest;
