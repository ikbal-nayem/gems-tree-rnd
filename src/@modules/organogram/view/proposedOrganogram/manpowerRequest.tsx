import {
  ITableHeadColumn,
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
    { title: COMMON_LABELS.SL_NO, width: 20, align:"center" },
    { title: "প্রতিষ্ঠান", width: 145},
    { title: "পদের নাম ও সংখ্যা", width: 145, align:"center" },
    { title: "প্রস্তাবিত পদ  ও সংখ্যা", width: 145, align:"center" },
  ];

  dataList = [
    {
      id: "sdfsdfef",
      officeTitleBn: "Organisation A",
      manpowerList: [
        {
          postNameBn: "sasd",
          manpower: 1,
        },
        {
          postNameBn: "xcv",
          manpower: 2,
        },
        {
          postNameBn: "wer",
          manpower: 5,
        },
      ],
    },
    {
      id: "khjkgf",
      officeTitleBn: "Organisation B",
      manpowerList: [
        {
          postNameBn: "vvv",
          manpower: 1,
        },
        {
          postNameBn: "ddd",
          manpower: 3,
        },
        {
          postNameBn: "fff",
          manpower: 4,
        },
      ],
    },
  ];

  return (
    <div className="card p-5">
      <Table columns={columns}>
        {dataList?.length ? (
          dataList?.map((office, idx) => (
            <TableRow key={idx}>
              <TableCell verticalAlign="middle" text={generateRowNumBn(idx)} />
              <TableCell text={office?.officeTitleBn} />
              <TableCell>
                <MpNode officeData={office} />
              </TableCell>
              <TableCell></TableCell>
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