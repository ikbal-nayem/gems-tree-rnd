import { MENU } from "@constants/menu-titles.constant";
import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Button,
  ConfirmationModal,
  ContentPreloader,
  DownloadMenu,
  NoData,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  exportXLSX,
  generatePDF,
  numEnToBn,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import Form from "./Form";
import { organizationTypePDFContent } from "./pdf";
import DataTable from "./Table";
import { isNotEmptyList } from "utility/utils";

const OrganizationTypeList = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});


  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, []);

  const getDataList = (reqMeta = null) => {
    OMSService.FETCH.organizationTypeList()
      .then((res) => {
        setListData(res?.body || []);
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsUpdate(false);
    setUpdateData({});
  };

  const handleUpdate = (data: any) => {
    setIsUpdate(true);
    setUpdateData(data);
    setIsDrawerOpen(true);
  };

  const handleDelete = (data: any) => {
    setIsDeleteModal(true);
    setDeleteData(data);
  };
  const onCancelDelete = () => {
    setIsDeleteModal(false);
    setDeleteData(null);
  };
  const onConfirmDelete = () => {
    setIsDeleteLoading(true);
    let payload = {
      body: {
        ids: [deleteData?.id || ""],
      },
    };
    OMSService.DELETE.organizationType(payload)
      .then((res) => {
        toast.success(res?.message);
        getDataList();
        setDeleteData(null);
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsDeleteLoading(false);
        setIsDeleteModal(false);
      });
  };

  const onSubmit = (data) => {
    setIsSubmitLoading(true);

    data = isUpdate
      ? {
          ...data,
          id: updateData?.id || "",
          orgCategoryType: "ORG_CATEGORY_TYPE",
        }
      : {
          ...data,
          orgCategoryType: "ORG_CATEGORY_TYPE",
        };

    const service = isUpdate
      ? OMSService.UPDATE.organizationType
      : OMSService.SAVE.organizationType;
    service(data)
      .then((res) => {
        toast.success(res?.message);
        getDataList();
        setIsDrawerOpen(false);
        setIsUpdate(false);
        setUpdateData({});
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    downloadtype === "pdf"
      ? generatePDF(organizationTypePDFContent(listData))
      : exportXLSX(exportData(listData || []), "প্রতিষ্ঠানের ধরণের তালিকা");
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "নাম (বাংলা)": d?.nameBn || COMMON_LABELS.NOT_ASSIGN,
      "নাম (ইংরেজি)": d?.nameEn || COMMON_LABELS.NOT_ASSIGN,
      লেভেল: d?.orgTypeLevel || COMMON_LABELS.NOT_ASSIGN,
      সক্রিয়:
        (d?.isActive ? "সক্রিয়" : "সক্রিয় নয়") || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>{MENU.BN.ORANIZATION_TYPE}</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>
      <div className="card p-5">
        {isNotEmptyList(listData) && (
          <div className="d-flex justify-content-between gap-3 mb-6">
            <h5 className="mt-3">মোট : {numEnToBn(listData?.length)} টি</h5>
            <DownloadMenu
              fnDownloadExcel={() => downloadFile("excel")}
              fnDownloadPDF={() => downloadFile("pdf")}
            />
          </div>
        )}

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
          {!isLoading && !listData?.length && (
            <NoData details="কোনো প্রতিষ্ঠানের ধরণের তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}

        {/* =========================================================== Form STARTS ============================================================ */}
        <Form
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          onSubmit={onSubmit}
          submitLoading={isSubmitLoading}
        />
        {/* =========================================================== FORM ENDS============================================================ */}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModal}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        isSubmitting={isDeleteLoading}
        onConfirmLabel={"মুছে ফেলুন"}
      >
        আপনি কি আসলেই <b>{deleteData?.nameBn || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default OrganizationTypeList;
