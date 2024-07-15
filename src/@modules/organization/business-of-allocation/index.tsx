import { MENU } from "@constants/menu-titles.constant";
import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  ContentPreloader,
  DownloadMenu,
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
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DataTable from "./Table";
import { useAuth } from "@context/Auth";
import { isNotEmptyList } from "utility/utils";
import { organizationTypePDFContent } from "./pdf";

const initMeta: IMeta = {
  page: 0,
  limit: 20,
  sort: [
    {
      field: "code",
      order: "asc",
    },
    {
      field: "serialNo",
      order: "asc",
    },
  ],
};

const BusinessOfAllocation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const { state } = useLocation();
  const [organization, setOrganization] = useState<IObject>(state);
  const { currentUser } = useAuth();

  useEffect(() => {
    // setOrganization(currentUser?.organization);
    getDataList();
  }, []);

  const getDataList = (reqMeta = null) => {
    // const payload = {
    //   meta: reqMeta || respMeta,
    //   body: {
    //     // organization
    //   },
    // };

    OMSService.FETCH.allocationOfBusinessListByOrgId(organization?.id)
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

  // const onCustomSelection = (organization) => {
  //   setOrganization(
  //     organization
  //       ? {
  //           id: organization?.id,
  //           nameBn: organization?.nameBn,
  //         }
  //       : null
  //   );
  //   console.log("index Organization : ", organization);
  // };

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    downloadtype === "pdf"
      ? generatePDF(organizationTypePDFContent(listData, organization?.nameBn))
      : exportXLSX(
          exportData(listData || []),
          organization?.nameBn + " এর কর্মবন্টনের তালিকা"
        );
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "কর্মবন্টন (বাংলা)": d?.businessOfAllocationBn || COMMON_LABELS.NOT_ASSIGN,
      "কর্মবন্টন (ইংরেজি)": d?.businessOfAllocationEn || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>
        {MENU.BN.ALLOCATION_OF_BUSINESS_LIST +
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
            // handleUpdate={handleUpdate}
            // handleDelete={handleDelete}
          >
            {/* <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            /> */}
          </DataTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !listData?.length && (
            <NoData details="কোনো প্রতিষ্ঠানের ধরন তথ্য পাওয়া যায়নি!" />
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
export default BusinessOfAllocation;
