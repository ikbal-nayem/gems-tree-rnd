import { MENU } from "@constants/menu-titles.constant";
import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
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
  exportXLSX,
  generatePDF,
  numEnToBn,
  searchParamsToObject,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { isNotEmptyList } from "utility/utils";
import Form from "./Form";
import DataTable from "./Table";
import { organogramChangeTypePDFContent } from "./pdf";

const initMeta: IMeta = {
  page: 0,
  limit: 10,
  sort: [
    {
      field: "createdOn",
      order: "desc",
    },
  ],
};

const ChangeType = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const [respMeta, setRespMeta] = useState<any>(initMeta);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey]);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [searchParams]);

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta }
          : { ...respMeta, page: 0 }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
      },
    };

    const reqData = { ...payload, body: payload?.body };
    ProposalService.FETCH.organogramChangeTypeList(reqData)
      .then((res) => {
        setListData(res?.body || []);
        setRespMeta(
          res?.meta ? { ...res?.meta } : { limit: respMeta?.limit, page: 0 }
        );
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => setIsLoading(false));
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
        }
      : {
          ...data,
        };

    const service = isUpdate
      ? ProposalService.UPDATE.organogramChangeType
      : ProposalService.SAVE.organogramChangeType;
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
    topProgress.show();
    const payload = {
      meta: {
        page: 0,
        limit: respMeta.totalRecords,
        sort: [
          {
            order: "desc",
            field: "createdOn",
          },
        ],
      },
      body: {
        searchKey: searchKey || null,
      },
    };

    ProposalService.FETCH.organogramChangeTypeList(payload)
      .then((res) =>
        downloadtype === "pdf"
          ? generatePDF(organogramChangeTypePDFContent(res?.body))
          : exportXLSX(exportData(res?.body || []), "Organization Type list")
      )
      .catch((err) => toast.error(err?.message))
      .finally(() => topProgress.hide());
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "নাম (বাংলা)": d?.nameBn || COMMON_LABELS.NOT_ASSIGN,
      "নাম (ইংরেজি)": d?.nameEn || COMMON_LABELS.NOT_ASSIGN,
      লেভেল: numEnToBn(d?.orgTypeLevel) || COMMON_LABELS.NOT_ASSIGN,
      সক্রিয়:
        (d?.isActive ? "সক্রিয়" : "সক্রিয় নয়") || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>{MENU.BN.ORGANOGRAM_CHANGE_TYPE}</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>

      <div className="card p-5">
        <div className="d-flex gap-3 mb-3">
          <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ... "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <DownloadMenu
            fnDownloadExcel={() => downloadFile("excel")}
            fnDownloadPDF={() => downloadFile("pdf")}
          />
        </div>
        {isNotEmptyList(listData) && (
          <div className="d-flex justify-content-between gap-3 mb-6">
            <h5 className="mt-3">
              মোট : {numEnToBn(respMeta?.totalRecords)} টি
            </h5>
          </div>
        )}

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <DataTable
            data={listData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </DataTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !listData?.length && (
            <NoData details="কোনো পরিবর্তনের ধরণের তথ্য পাওয়া যায়নি!" />
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
export default ChangeType;
