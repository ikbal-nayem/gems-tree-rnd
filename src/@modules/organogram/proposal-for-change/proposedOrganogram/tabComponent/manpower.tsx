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
import MpBlock from "./manpowerBlock";

type TableProps = {
  dataList: any[];
  isEnamCommittee: boolean;
};

const Manpower: FC<TableProps> = ({ dataList, isEnamCommittee }) => {
  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 20, align: "center" },
    { title: "পদবি/স্তর", width: 145 },
    { title: "পদের নাম ও সংখ্যা", width: 145, align: "center" },
    { title: "প্রস্তাবিত পদের নাম ও সংখ্যা", width: 145, align: "center" },
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
                verticalAlign="middle"
                text={
                  (isEnamCommittee ? node?.nodeTitleEn : node?.nodeTitleBn) ||
                  "-"
                }
              />
              <TableCell>
                <MpBlock
                  nodeData={node}
                  isEnamCommittee={isEnamCommittee}
                  color="light"
                />
              </TableCell>
              <TableCell>
                <MpBlock
                  nodeData={node}
                  isEnamCommittee={isEnamCommittee}
                  color="secondary"
                />
              </TableCell>
              <TableCell textAlign="end" verticalAlign="middle">
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

export default Manpower;
