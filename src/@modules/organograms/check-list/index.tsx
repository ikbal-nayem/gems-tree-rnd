import { MENU } from "@constants/menu-titles.constant";
import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Autocomplete,
  Button,
  ConfirmationModal,
  ContentPreloader,
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
  numEnToBn,
  topProgress,
} from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isNotEmptyList } from "utility/utils";
import CreateForm from "./CreateForm";
import DataTable from "./Table";
import UpdateForm from "./UpdateForm";
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

const CheckList = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState<boolean>(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [updateData, setUpdateData] = useState<any>({});
  const [changeTypeList, setChangeTypeList] = useState<IObject[]>([]);
  const [respMeta, setRespMeta] = useState<any>(initMeta);
  const { control } = useForm();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [search, setSearch] = useState<string>(
  //   searchParams.get("searchKey") || ""
  // );
  // const params: any = searchParamsToObject(searchParams);
  // const searchKey = useDebounce(search, 500);
  const [changeTypeFilterKey, setChangeTypeFilterKey] = useState<String>("");

  // useEffect(() => {
  //   if (searchKey) params.searchKey = searchKey;
  //   else delete params.searchKey;
  //   setSearchParams({ ...params });
  //   // eslint-disable-next-line
  // }, [searchKey]);

  useEffect(() => {
    const payload = {
      meta: {
        page: 0,
        limit: 100,
        sort: [
          {
            field: "createdOn",
            order: "desc",
          },
        ],
      },
      body: {},
    };
    ProposalService.FETCH.organogramChangeTypeList(payload)
      .then((res) => {
        setChangeTypeList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));
  }, []);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [changeTypeFilterKey]);

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: changeTypeFilterKey
        ? reqMeta
          ? { ...reqMeta }
          : { ...respMeta, page: 0 }
        : reqMeta || respMeta,
      body: {
        orgChangeType: changeTypeFilterKey || "",
      },
    };

    // const reqData = { ...payload, body: payload?.body };
    ProposalService.FETCH.organogramChecklist(payload)
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

  const onCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);
  };

  const onUpdateDrawerClose = () => {
    setIsUpdateDrawerOpen(false);
    setUpdateData({});
  };

  const handleUpdate = (data: any) => {
    setUpdateData(data || {});
    setIsUpdateDrawerOpen(true);
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
    ProposalService.DELETE.organogramChecklist(payload)
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

  const onCreateSubmit = (data) => {
    setIsSubmitLoading(true);

    let reqData = data?.checklist?.map((d) => {
      return {
        ...d,
        organogramChangeTypeDto: data?.organogramChangeTypeDto,
        organogramChangeTypeId: data?.organogramChangeTypeId,
      };
    });

    ProposalService.SAVE.organogramChecklist(reqData)
      .then((res) => {
        toast.success(res?.message);
        getDataList();
        setIsCreateDrawerOpen(false);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  const onUpdateSubmit = (data) => {
    setIsSubmitLoading(true);

    data = {
      ...data,
      id: updateData?.id || "",
    };

    ProposalService.UPDATE.organogramChecklist(data)
      .then((res) => {
        toast.success(res?.message);
        getDataList();
        setIsUpdateDrawerOpen(false);
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
        orgChangeType: changeTypeFilterKey || "",
      },
    };

    ProposalService.FETCH.organogramChangeTypeList(payload)
      .then((res) =>
        downloadtype === "pdf"
          ? generatePDF(organogramChangeTypePDFContent(res?.body))
          : exportXLSX(
              exportData(res?.body || []),
              "Organogram change type list"
            )
      )
      .catch((err) => toast.error(err?.message))
      .finally(() => topProgress.hide());
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "নাম (বাংলা)": d?.titleBN || COMMON_LABELS.NOT_ASSIGN,
      "নাম (ইংরেজি)": d?.titleEN || COMMON_LABELS.NOT_ASSIGN,
      কোড: d?.code || COMMON_LABELS.NOT_ASSIGN,
      সক্রিয়:
        (d?.isActive ? "সক্রিয়" : "সক্রিয় নয়") || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>{MENU.BN.ORGANOGRAM_CHECKLIST}</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsCreateDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>

      <div className="card p-5">
        <div className="d-flex gap-3 mb-3">
          {/* <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ... "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}

          <div className="min-w-250px">
            <Autocomplete
              label="পরিবর্তনের ধরণ"
              placeholder="পরিবর্তনের ধরণ বাছাই করুন"
              isRequired="পরিবর্তনের ধরণ বাছাই করুন"
              options={changeTypeList || []}
              name="organogramChangeTypeDto"
              getOptionLabel={(op) => op.titleBN}
              getOptionValue={(op) => op.id}
              control={control}
              onChange={(op) => setChangeTypeFilterKey(op?.id)}
            />
          </div>
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
        <CreateForm
          isOpen={isCreateDrawerOpen}
          onClose={onCreateDrawerClose}
          changeTypeList={changeTypeList}
          onSubmit={onCreateSubmit}
          submitLoading={isSubmitLoading}
        />
        <UpdateForm
          isOpen={isUpdateDrawerOpen}
          onClose={onUpdateDrawerClose}
          changeTypeList={changeTypeList}
          updateData={updateData}
          onSubmit={onUpdateSubmit}
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
        আপনি কি আসলেই <b>{deleteData?.titleBn || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default CheckList;
