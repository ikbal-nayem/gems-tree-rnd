import { LABELS } from "@constants/common.constant";
import {
  ITableHeadColumn,
  Icon,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import "../style.scss";
import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";

const columns: ITableHeadColumn[] = [
  { title: COMMON_LABELS.SL_NO, minWidth: 50 },
  { title: "তালিকা (বাংলা)", minWidth: 200 },
  { title: "তালিকা (ইংরেজি)", minWidth: 200 },
  { title: "বাধ্যতামূলক", minWidth: 75 },
];

interface ICheckListForm {
  data: any;
}

const CheckListForm = ({ data }: ICheckListForm) => {
  return (
    <div className="card border p-3">
      <div className="card-head d-flex justify-content-between align-items-center">
        <h4 className="m-0">{LABELS.BN.CHECK_LIST}</h4>
      </div>
      <Separator className="mt-1 mb-2" />
      <div>
        {data?.length > 0 && (
          <Table columns={columns}>
            {data?.map((data, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{generateRowNumBn(i)}</TableCell>
                  <TableCell>
                    {data?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                  </TableCell>
                  <TableCell>
                    {data?.titleEn || COMMON_LABELS.NOT_ASSIGN}
                  </TableCell>

                  <TableCell>
                    {data?.isMandatory ? (
                      <Icon icon="done" color="success" size={16} />
                    ) : (
                      <Icon icon="close" color="danger" size={16} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        )}
      </div>
    </div>
  );
};

export default CheckListForm;
