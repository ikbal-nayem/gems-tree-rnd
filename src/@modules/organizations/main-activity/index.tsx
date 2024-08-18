import { MENU } from "@constants/menu-titles.constant";
import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Autocomplete,
  Button,
  ConfirmationModal,
  ContentPreloader,
  DownloadMenu,
  Input,
  NoData,
  Pagination,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  IMeta,
  IObject,
  exportXLSX,
  generatePDF,
  notNullOrUndefined,
  numEnToBn,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import Form from "./Form";
import DataTable from "./Table";
import { organizationTypePDFContent } from "./pdf";
import { isNotEmptyList } from "utility/utils";

const initMeta: IMeta = {
  page: 0,
  limit: 20,
  sort: [
    {
      field: "displayOrder",
      order: "asc",
    },
  ],
};

const MainActivity = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const { state } = useLocation();
  const [organization, setOrganization] = useState<IObject>(state);
  // const [orgType, setOrgType] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  // const [orgTypeList, setOrgTypeList] = useState<IObject[]>([]);
  // const formProps = useForm();
  // const { control } = formProps;

  useEffect(() => {
    getDataList();
  }, []);

  // const getOrganizationTypesList = () => {
  //   OMSService.FETCH.organizationTypeList()
  //     .then((res) => {
  //       setOrgTypeList(res?.body || []);
  //     })
  //     .catch((err) => toast.error(err?.message));
  // };

  const getDataList = (reqMeta = null) => {
    OMSService.FETCH.mainActivityListByOrgId(organization?.id)
      .then((res) => {
        setListData(res?.body || []);
        setRespMeta(
          res?.meta ? { ...res?.meta } : { limit: respMeta?.limit, page: 0 }
        );
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
  };

  // const onDrawerClose = () => {
  //   setIsDrawerOpen(false);
  //   setIsUpdate(false);
  //   setUpdateData({});
  // };

  const handleUpdate = (data: any) => {
    setIsUpdate(true);
    setUpdateData(data);
    setIsDrawerOpen(true);
  };

  const handleDelete = (data: any) => {
    setIsDeleteModal(true);
    setDeleteData(data);
  };
  // const onCancelDelete = () => {
  //   setIsDeleteModal(false);
  //   setDeleteData(null);
  // };
  // const onConfirmDelete = () => {
  //   setIsDeleteLoading(true);
  //   let payload = {
  //     body: {
  //       ids: [deleteData?.id || ""],
  //     },
  //   };
  //   OMSService.organizationTypeDelete(payload)
  //     .then((res) => {
  //       toast.success(res?.message);
  //       getDataList();
  //       setDeleteData(null);
  //     })
  //     .catch((err) => toast.error(err?.message))
  //     .finally(() => {
  //       setIsDeleteLoading(false);
  //       setIsDeleteModal(false);
  //     });
  // };

  // const onSubmit = (data) => {
  //   setIsSubmitLoading(true);

  //   const service = isUpdate
  //     ? OMSService.organizationTypeUpdate
  //     : OMSService.organizationTypeCreate;
  //   service(isUpdate ? { ...data, id: updateData?.id || "" } : data)
  //     .then((res) => {
  //       toast.success(res?.message);
  //       getDataList();
  //       setIsDrawerOpen(false);
  //       setIsUpdate(false);
  //       setUpdateData({});
  //     })
  //     .catch((error) => toast.error(error?.message))
  //     .finally(() => setIsSubmitLoading(false));
  // };

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    downloadtype === "pdf"
      ? generatePDF(organizationTypePDFContent(listData, organization?.nameBn))
      : exportXLSX(
          exportData(listData || []),
          organization?.nameBn + " এর প্রধান কার্যাবলির তালিকা"
        );
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "প্রধান কার্যাবলি (বাংলা)": d?.mainActivityBn || COMMON_LABELS.NOT_ASSIGN,
      "প্রধান কার্যাবলি (ইংরেজি)": d?.mainActivityEn || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>
        {MENU.BN.MAIN_ACTIVITY_LIST +
          (isNotEmptyList(listData)
            ? " (মোট: " + numEnToBn(listData?.length) + " টি)"
            : "")}
      </PageTitle>
      {/* <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight> */}
      <div className="card p-5">
        <div className="d-flex gap-3">
          {!isLoading && (
            <div className="row fs-3 w-100">
              <div className="col-12 col-md-11">
                <div className="d-flex fw-bold text-gray-700 gap-3">
                  <div>প্রতিষ্ঠান :</div>
                  <div>{organization?.nameBn}</div>
                </div>
              </div>
              <div className="col-12 col-md-1 text-end">
                {isNotEmptyList(listData) && (
                  <DownloadMenu
                    fnDownloadExcel={() => downloadFile("excel")}
                    fnDownloadPDF={() => downloadFile("pdf")}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <DataTable
            data={listData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          >
            {/* <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            /> */}
          </DataTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !isNotEmptyList(listData) && (
            <NoData details="কোনো তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}

        {/* =========================================================== Form STARTS ============================================================ */}
        {/* <Form
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          onSubmit={onSubmit}
          submitLoading={isSubmitLoading}
        /> */}
        {/* =========================================================== FORM ENDS============================================================ */}
      </div>
      {/* <ConfirmationModal
        isOpen={isDeleteModal}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        isSubmitting={isDeleteLoading}
        onConfirmLabel={"মুছে ফেলুন"}
      >
        আপনি কি আসলেই <b>{deleteData?.nameBn || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal> */}
    </>
  );
};
export default MainActivity;
