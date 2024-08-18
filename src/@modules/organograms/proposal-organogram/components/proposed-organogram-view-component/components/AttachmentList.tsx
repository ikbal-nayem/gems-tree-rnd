import { LABEL } from "../local-constants";
import {
  ITableHeadColumn,
  MediaPreview,
  Separator,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  generateDateFormat,
  isObjectNull,
  numBnToEn,
} from "@gems/utils";
import { FC } from "react";

type TableProps = {
  data: any;
  langEn: boolean;
};

const AttachmentList: FC<TableProps> = ({ data, langEn }) => {
  const LOCAL_LABEL = langEn ? LABEL.EN : LABEL;
  const columns: ITableHeadColumn[] = [
    { title: LOCAL_LABEL.NAME, minWidth: 100 },
    { title: LOCAL_LABEL.GO_NUMBER, minWidth: 100 },
    { title: LOCAL_LABEL.GO_DATE, minWidth: 100 },
    { title: LOCAL_LABEL.ATTACHMENT, minWidth: 100 },
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
                  <TableCell
                    text={
                      (langEn ? item?.goNoEn : item?.goNoBn) ||
                      COMMON_LABELS.NOT_ASSIGN
                    }
                  />
                  <TableCell
                    text={
                      item?.goDate
                        ? langEn
                          ? numBnToEn(
                              generateDateFormat(
                                item?.goDate,
                                DATE_PATTERN.GOVT_STANDARD
                              )
                            )
                          : generateDateFormat(
                              item?.goDate,
                              "%dd% %MM%, %yyyy%"
                            )
                        : COMMON_LABELS.NOT_ASSIGN
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
      ) : null}
    </div>
  );
};

export default AttachmentList;
