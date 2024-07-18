import {
    Dropdown,
    DropdownItem,
    ITableHeadColumn,
    Icon,
    Table,
    TableCell,
    TableRow,
  } from "@gems/components";
  import { COMMON_LABELS, generateRowNumBn } from "@gems/utils";
  import { FC, ReactNode } from "react";
  
  const columns: ITableHeadColumn[] = [
    { title: COMMON_LABELS.SL_NO, minWidth: 50 },
    { title: "নাম", minWidth: 200 },
    { title: "এনাম কমিটি", minWidth: 100 },
    { title: COMMON_LABELS.ACTIVE, minWidth: 75 },
    { title: COMMON_LABELS.ACTION },
  ];
  
  type TableProps = {
    children?: ReactNode;
    data?: any;
    handleUpdate: (data) => void;
    handleDelete: (data) => void;
  };
  
  const OrgPostTable: FC<TableProps> = ({
    children,
    data = [],
    handleUpdate,
    handleDelete,
  }) => {
    if (!data?.length) return;
    return (
      <>
        <Table columns={columns}>
          {data?.map((data, i) => {
            return (
              <TableRow key={i}>
                <TableCell text={generateRowNumBn(i)} />
  
                <TableCell
                  text={data?.postNameBn || COMMON_LABELS.NOT_ASSIGN}
                  subText={data?.postNameEn}
                />
                <TableCell isActive={data?.isEnum} />
                <TableCell isActive={data?.isActive} />
                <TableCell>
                  <Dropdown
                    btnIcon={true}
                    btnContent={<Icon icon="more_vert" size={20} />}
                  >
                    <DropdownItem
                      onClick={() => {
                        handleUpdate(data);
                      }}
                    >
                      <Icon size={19} icon="edit" />
                      <h6 className="mb-0 ms-3">সম্পাদনা করুন</h6>
                    </DropdownItem>
                    
                    <DropdownItem
                      // onClick={() => {
                      //   handleUpdate(data); //approve section
                      // }}
                    >
                      <Icon size={19} icon="approval" />
                      <h6 className="mb-0 ms-3">অনুমোদন</h6>
                    </DropdownItem>
  
                    <DropdownItem
                      onClick={() => {
                        handleDelete(data);
                      }}
                    >
                      <Icon size={19} icon="delete" color="danger" />
                      <h6 className="mb-0 ms-3 text-danger">মুছে ফেলুন</h6>
                    </DropdownItem>
  
                  </Dropdown>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
        {children}
      </>
    );
  };
  
  export default OrgPostTable;
  