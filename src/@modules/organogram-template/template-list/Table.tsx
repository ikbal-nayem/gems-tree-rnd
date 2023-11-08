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
import { FC, ReactNode, useState } from "react";
import { LABELS } from "./labels";
import { useNavigate } from "react-router-dom";
import TemplateClone from "./clone";
import { ROUTE_L2 } from "@constants/internal-route.constant";

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
  const [templateId, setTemplateId] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onClose = () => setIsOpen(false);
  const onClone = (id) => {
    setTemplateId(id);
    setIsOpen(true);
  };

  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, width: 50 },
    { title: LABELS.NAME, width: 250 },
    { title: COMMON_LABELS.ACTION, width: 80, align: "end" },
  ];

  const navigate = useNavigate();
  const navigateToDetails = (id: string) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_UPDATE + "?id=" + id);
  };
  const navigateToView = (id: string) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + id);
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
                  <DropdownItem onClick={() => navigateToView(item?.id)}>
                    <Icon size={19} icon="visibility" />
                    <h6 className="mb-0 ms-3">দেখুন</h6>
                  </DropdownItem>
                  <DropdownItem onClick={() => navigateToDetails(item?.id)}>
                    <Icon size={19} icon="edit" />
                    <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                  </DropdownItem>
                  <DropdownItem onClick={() => onClone(item?.id)}>
                    <Icon size={19} icon="file_copy" />
                    <h6 className="mb-0 ms-3">ডুপ্লিকেট করুন</h6>
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

      <TemplateClone
        isOpen={isOpen}
        onClose={onClose}
        templateId={templateId}
      />
    </>
  );
};

export default TemplateTable;
