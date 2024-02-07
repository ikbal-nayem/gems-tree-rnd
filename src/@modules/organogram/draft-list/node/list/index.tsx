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
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import DataTable from "./Table";
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

const OrganogramNodeList = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  // const [orgType, setOrgType] = useState<string>("");
  // const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);
  // const [orgTypeList, setOrgTypeList] = useState<IObject[]>([]);
  // const formProps = useForm();
  // const { control } = formProps;

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  // useEffect(() => {
  //   getOrganizationTypesList();
  // }, []);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [
    searchParams,
    // orgType
  ]);

  // const getOrganizationTypesList = () => {
  //   OMSService.FETCH.organizationTypeList()
  //     .then((res) => {
  //       setOrgTypeList(res?.body || []);
  //     })
  //     .catch((err) => toast.error(err?.message));
  // };

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        // parentId: orgType || null,
      },
    };

    OMSService.getOrganizationTypeList(payload)
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

  // const handleUpdate = (data: any) => {
  //   setIsUpdate(true);
  //   setUpdateData(data);
  //   setIsDrawerOpen(true);
  // };

  // const handleDelete = (data: any) => {
  //   setIsDeleteModal(true);
  //   setDeleteData(data);
  // };
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
    topProgress.show();
    const payload = {
      meta: {
        page: 0,
        limit: respMeta.totalRecords,
        sort: [{ field: "createdOn", order: "desc" }],
      },
      body: {
        searchKey: searchKey || null,
      },
    };

    OMSService.getOrganizationTypeList(payload)
      .then((res) =>
        downloadtype === "pdf"
          ? generatePDF(organizationTypePDFContent(res?.body))
          : exportXLSX(exportData(res?.body || []), "Organization Type list")
      )
      .catch((err) => toast.error(err?.message))
      .finally(() => topProgress.hide());
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "ধরণ (বাংলা)": d?.orgTypeBn || COMMON_LABELS.NOT_ASSIGN,
      "ধরণ (ইংরেজি)": d?.orgType || COMMON_LABELS.NOT_ASSIGN,
      "গ্রুপ (বাংলা)": d?.orgGroupBn || COMMON_LABELS.NOT_ASSIGN,
      "গ্রুপ (ইংরেজি)": d?.orgGroupEn || COMMON_LABELS.NOT_ASSIGN,
      লেভেল: d?.orgLevel || COMMON_LABELS.NOT_ASSIGN,
      সক্রিয়: d?.isActive ? "True" : "False" || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>
        {MENU.BN.NODE_LIST +
          (notNullOrUndefined(respMeta?.totalRecords)
            ? " (মোট: " + numEnToBn(respMeta?.totalRecords) + " টি)"
            : "")}
      </PageTitle>
      {/* <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight> */}
      <div className="card p-5">
        {respMeta.totalRecords && (
          <div className="d-flex gap-3">
            {/* <span className="w-25">
              <Autocomplete
                placeholder="সংস্থার ধরণ বাছাই করুন"
                options={orgTypeList || []}
                name="organizationTypeDTO"
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => setOrgType(op?.id)}
                control={control}
              />
            </span> */}

            <Input
              type="search"
              noMargin
              placeholder="অনুসন্ধান করুন ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
            // handleUpdate={handleUpdate}
            // handleDelete={handleDelete}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </DataTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !listData?.length && (
            <NoData details="কোনো প্রতিষ্ঠানের ধরণ তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}

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
export default OrganogramNodeList;
