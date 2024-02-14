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
  DATE_PATTERN,
  IMeta,
  IObject,
  exportXLSX,
  generateDateFormat,
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
import FormUpdate from "./FormUpdate";
import DataTable from "./Table";
import { organizationTypePDFContent } from "./pdf";
import { isNotEmptyList } from "utility/utils";
import FormCreate from "./FormCreate";

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
  const { state } = useLocation();
  const [organogram] = useState<any>(state);
  const [isFormCreateOpen, setIsFormCreateOpen] = useState<boolean>(false);
  const [isFormUpdateOpen, setIsFormUpdateOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [respMeta, setRespMeta] = useState<IMeta>(initMeta);

  useEffect(() => {
    getDataList();
  }, []);

  const getDataList = (reqMeta = null) => {
    if (notNullOrUndefined(organogram) && notNullOrUndefined(organogram.id)) {
      OMSService.FETCH.organogramMainActivityById(organogram?.id)
        .then((res) => {
          setListData(res?.body || []);
          // setRespMeta(
          //   res?.meta ? { ...res?.meta } : { limit: respMeta?.limit, page: 0 }
          // );
        })
        .catch((err) => toast.error(err?.message));
    }
    setIsLoading(false);
  };

  // const onPageChanged = (metaParams: IMeta) => {
  //   getDataList({ ...metaParams });
  // };

  const onDrawerClose = () => {
    setIsFormCreateOpen(false);
    setIsFormUpdateOpen(false);
    setIsUpdate(false);
    setUpdateData({});
  };

  const handleUpdate = (data: any) => {
    setIsUpdate(true);
    setUpdateData(data);
    setIsFormUpdateOpen(true);
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
    OMSService.DELETE.organogramMainActivity(payload)
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
    data = {
      ...data,
      organizationOrganogramId: organogram?.id,
      organizationId: organogram?.orgId,
      organogramDate: organogram?.organogramDate,
    };

    data = isUpdate
      ? {
          ...data,
          id: updateData?.id || "",
        }
      : data;

    let service = isUpdate
      ? OMSService.UPDATE.organogramMainActivity
      : OMSService.SAVE.organogramMainActivity;
    // console.log(data);

    service(data)
      .then((res) => {
        toast.success(res?.message);
        getDataList();
        setIsFormCreateOpen(false);
        setIsFormUpdateOpen(false);
        setIsUpdate(false);
        setUpdateData({});
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    downloadtype === "pdf"
      ? generatePDF(
          organizationTypePDFContent(listData, organogram?.organizationNameBn)
        )
      : exportXLSX(
          exportData(listData || []),
          organogram?.organizationNameBn + " এর প্রধান কার্যাবলির তালিকা"
        );
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "প্রধান কার্যাবলি (বাংলা)": d?.mainActivityBn || "-",
      "প্রধান কার্যাবলি (ইংরেজি)": d?.mainActivityEn || "-",
    }));

  return (
    <>
      <PageTitle>
        {MENU.BN.MAIN_ACTIVITY_LIST +
          (isNotEmptyList(listData)
            ? " (মোট: " + numEnToBn(listData?.length) + " টি)"
            : "")}
      </PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsFormCreateOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>
      <div className="card p-5">
        <div className="d-flex gap-3">
          {!isLoading && (
            <div className="row fs-3 w-100">
              <div className="col-12 col-md-11">
                <div className="d-flex fw-bold text-gray-700 gap-3">
                  <div>প্রতিষ্ঠান :</div>
                  <div>{organogram?.organizationNameBn}</div>
                </div>
                <div className="mb-3 fs-5 fw-bold text-gray-700">
                  অর্গানোগ্রাম তারিখ :{" "}
                  {organogram?.isEnamCommittee
                    ? "26/12/1982"
                    : organogram?.organogramDate
                    ? generateDateFormat(
                        organogram?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )
                    : COMMON_LABELS.NOT_ASSIGN}
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
        <FormCreate
          isOpen={isFormCreateOpen}
          onClose={onDrawerClose}
          onSubmit={onSubmit}
          submitLoading={isSubmitLoading}
          organogram={organogram}
        />
        <FormUpdate
          isOpen={isFormUpdateOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          onSubmit={onSubmit}
          submitLoading={isSubmitLoading}
          organogram={organogram}
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
        আপনি কি আসলেই কার্যক্রমটি মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default MainActivity;
