import {
  ContentPreloader,
  Dropdown,
  DropdownItem,
  ITableHeadColumn,
  Icon,
  NoData,
  Table,
  TableCell,
  TableRow,
} from "@gems/components";
import { COMMON_LABELS, IMeta, generateRowNumBn } from "@gems/utils";
import { FC, ReactNode } from "react";
import { LABELS } from "./labels";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@constants/internal-route.constant";

type TableProps = {
  children: ReactNode;
  dataList: any[];
  isLoading: boolean;
  respMeta?: IMeta;
};

const TemplateTable: FC<TableProps> = ({
  children,
  dataList,
  isLoading,
  respMeta,
}) => {
  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 50 },
    { title: LABELS.NAME, width: 250 },
    { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  const navigateToDetails = (id: string) => {
    navigate(ROUTE.ORG_TEMPLATE_UPDATE + "?id=" + id);
  };

  return (
    <>
      {dataList?.length ? (
        <Table columns={columns}>
          {dataList?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell
                text={generateRowNumBn(idx, respMeta)}
                verticalAlign="top"
              />
              <TableCell
                text={item?.titleBn || COMMON_LABELS.NOT_ASSIGN}
                subText={item?.titleEn || COMMON_LABELS.NOT_ASSIGN}
              />
              <TableCell textAlign="end" verticalAlign="top">
                <Dropdown
                  btnIcon={true}
                  btnContent={<Icon icon="more_vert" size={20} />}
                  id={item?.id}
                >
                  <DropdownItem onClick={() => null}>
                    <Icon size={19} icon="visibility" />
                    <h6 className="mb-0 ms-3">দেখুন</h6>
                  </DropdownItem>
                  <DropdownItem onClick={() => navigateToDetails(item?.id)}>
                    <Icon size={19} icon="edit" />
                    <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                  </DropdownItem>
                  <DropdownItem onClick={() => null}>
                    <Icon size={19} icon="delete" color="danger" />
                    <h6 className="mb-0 ms-3 text-danger">মুছে ফেলুন</h6>
                  </DropdownItem>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      ) : isLoading ? (
        <ContentPreloader />
      ) : (
        // <Table columns={columns}>
        //   <TableRow>
        //     <TableCell />
        //     <TableCell>
        <NoData details="কোনো টেমপ্লেটের তথ্য পাওয়া যায়নি!" />
        //     </TableCell>
        //   </TableRow>
        // </Table>
      )}
      {children}
    </>
  );
};

export default TemplateTable;
