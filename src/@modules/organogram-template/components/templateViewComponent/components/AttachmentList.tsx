import { LABELS } from "@constants/common.constant";
import {
  ITableHeadColumn,
  MediaPreview,
  NoData,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, isObjectNull } from "@gems/utils";
import { FC } from "react";
import { LOCAL_LABELS } from "./labels";

type TableProps = {
  data: any;
  langEn: boolean;
};

const AttachmentList: FC<TableProps> = ({ data, langEn }) => {
  const LABEL = langEn ? LABELS.EN : LABELS.BN;
  const LOCAL_LABEL = langEn ? LOCAL_LABELS.EN : LOCAL_LABELS.BN;
  const columns: ITableHeadColumn[] = [
    { title: LOCAL_LABEL.NAME, minWidth: 100 },
    { title: LABEL.ATTACHMENT, minWidth: 100 },
  ];
  let idx = 1000; // lets take a common index for both parent-child list
  return (
    <div className="card border p-3">
      <h4 className="m-0">{LABEL.ATTACHMENT}</h4>
      <Separator className="mt-1 mb-0" />
      {data?.length > 0 ? (
        <Table columns={columns}>
          <>
            {data?.map((item) => {
              return (
                <TableRow key={idx++}>
                  <TableCell
                    text={
                      (langEn ? item?.titleEn : item?.titleBn) ||
                      COMMON_LABELS.NOT_ASSIGN
                    }
                  />
                  <TableCell>
                    {!isObjectNull(item?.checkAttachmentFile) ? (
                      <MediaPreview file={item?.checkAttachmentFile}>
                        <span className="text-primary">
                          {item?.checkAttachmentFile?.originalFileName}
                        </span>
                      </MediaPreview>
                    ) : (
                      COMMON_LABELS.NOT_ASSIGN
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        </Table>
      ) : (
        <NoData details={LABEL.ATTACHMENT + " এর কোনো তথ্য পাওয়া যায়নি!"} />
      )}
    </div>
  );
};

export default AttachmentList;
