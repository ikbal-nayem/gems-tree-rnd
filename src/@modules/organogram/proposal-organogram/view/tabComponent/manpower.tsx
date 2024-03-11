import {
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  NoData,
  Table,
  TableCell,
  TableRow,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  IObject,
  generateRowNumBn,
  isObjectNull,
  notNullOrUndefined,
} from "@gems/utils";
import { FC, useEffect, useState } from "react";
import MpBlock from "./manpowerBlock";
import { ProposalService } from "@services/api/Proposal.service";

type TableProps = {
  dataList: any[];
  isEnamCommittee: boolean;
  previousOrganogramId: string;
};

const Manpower: FC<TableProps> = ({
  dataList,
  isEnamCommittee,
  previousOrganogramId,
}) => {
  const [
    previousApprovedNodeWiseManpowerList,
    setPreviousApprovedNodeWiseManpowerList,
  ] = useState<IObject[]>([]);

  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 20, align: "center" },
    { title: "পদবি/স্তর", width: 145 },
    { title: "পদের নাম ও সংখ্যা", width: 145, align: "center" },
    { title: "প্রস্তাবিত পদের নাম ও সংখ্যা", width: 145, align: "center" },
    // { title: "প্রস্তাবিত পদ  ও সংখ্যা", width: 145, align: "center" },
    { title: COMMON_LABELS.ACTION, width: 145, align: "center" },
  ];

  useEffect(() => {
    ProposalService.FETCH.nodeWiseManpowerById(previousOrganogramId)
      .then((resp) => {
        setPreviousApprovedNodeWiseManpowerList(resp?.body);
        console.log("PreviousApprovedNodeWiseManpowerList", resp?.body);
      })
      .catch((e) => toast.error(e?.message));
  }, [previousOrganogramId]);

  // console.log(dataList);
  let previousSameNode = null,
    newNode = true;
  return (
    <div className="card p-5">
      <Table columns={columns}>
        {dataList?.length ? (
          dataList?.map((node, idx) => {

            previousSameNode = null;
            newNode = true;

            previousSameNode = previousApprovedNodeWiseManpowerList.find(
              (n) =>
                n?.nodeTitleBn === node?.nodeTitleBn ||
                n?.nodeTitleEn === node?.nodeTitleEn
            );
            newNode = isObjectNull(previousSameNode);

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
                  tagText={newNode ? "নতুন" : null} 
                  tagColor="info"
                />
                <TableCell>
                  <MpBlock
                    nodeData={previousSameNode}
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
            );
          })
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
