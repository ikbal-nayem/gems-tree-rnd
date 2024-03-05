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
import Form from "./Form";
import DataTable from "./Table";
import { organizationTypePDFContent } from "./pdf";

const initMeta: IMeta = {
  page: 0,
  limit: 100,
  sort: [
    {
      field: "code",
      order: "asc",
    },
  ],
};

const OrganizationGroupList = () => {
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
  const [orgType, setOrgType] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);
  const [orgTypeList, setOrgTypeList] = useState<IObject[]>([]);
  const formProps = useForm();
  const { control } = formProps;

  const payloadOf = (contentType: "ui" | "downloadFile", reqMeta = null) => {
    return {
      meta:
        contentType === "downloadFile"
          ? {
              page: 0,
              limit: respMeta.totalRecords,
              sort: [{ field: "code", order: "desc" }],
            }
          : searchKey || orgType
          ? reqMeta
            ? { ...reqMeta, sort: null }
            : { ...respMeta, page: 0, sort: null }
          : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        parentId: orgType || null,
        orgCategoryType: "ORG_CATEGORY_GROUP",
      },
    };
  };

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  useEffect(() => {
    getOrganizationTypesList();
  }, []);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [searchParams, orgType]);

  const getOrganizationTypesList = () => {
    OMSService.FETCH.organizationTypeList()
      .then((res) => {
        setOrgTypeList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));
  };

  const getDataList = (reqMeta = null) => {
    topProgress.show();
    OMSService.FETCH.organizationCategoryList(payloadOf("ui", reqMeta))
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
          orgCategoryType: "ORG_CATEGORY_GROUP",
        }
      : {
          ...data,
          orgCategoryType: "ORG_CATEGORY_GROUP",
        };

    // console.log("Group Data: ", data);

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
    topProgress.show();
    OMSService.FETCH.organizationCategoryList(payloadOf("downloadFile", null))
      .then((res) =>
        downloadtype === "pdf"
          ? generatePDF(organizationTypePDFContent(res?.body))
          : exportXLSX(
              exportData(res?.body || []),
              "প্রতিষ্ঠানের গ্রুপের তালিকা"
            )
      )
      .catch((err) => toast.error(err?.message))
      .finally(() => topProgress.hide());
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "নাম (বাংলা)": d?.nameBn || "-",
      "নাম (ইংরেজি)": d?.nameEn || "-",
      "প্রতিষ্ঠানের ধরণ": d?.parent?.nameBn || "-",
      "গ্রুপ অভিভাবক": d?.parentGroup?.nameBn || "-",
      "অভিভাবক প্রতিষ্ঠান": d?.parentOrganization?.nameBn || "-",
      সক্রিয়: (d?.isActive ? "সক্রিয়" : "সক্রিয় নয়") || "-",
    }));

  return (
    <>
      <PageTitle>{MENU.BN.ORGANIZATION_GROUP}</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>
      <div className="card p-5">
        {respMeta.totalRecords && (
          <div className="d-flex gap-3">
            <span className="w-25">
              <Autocomplete
                placeholder="সংস্থার ধরণ বাছাই করুন"
                options={orgTypeList || []}
                name="organizationTypeDTO"
                getOptionLabel={(op) => op.nameBn}
                getOptionValue={(op) => op.id}
                onChange={(op) => setOrgType(op?.id)}
                control={control}
              />
            </span>

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

        {!!listData?.length && (
          <div className="d-flex justify-content-between gap-3">
            <h5 className="mt-3">
              <div className="d-flex justify-content">
                <div className="text-gray-700">
                  {notNullOrUndefined(orgType)
                    ? orgTypeList?.find((ot) => ot?.id === orgType)?.nameBn +
                      " এর "
                    : "প্রতিষ্ঠানের "}
                  গ্রুপ মোট :
                </div>
                <div className="ps-2 text-info">
                  {numEnToBn(respMeta?.totalRecords)} টি
                </div>
              </div>
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
            <NoData details="কোনো প্রতিষ্ঠান-গ্রুপের তথ্য পাওয়া যায়নি!" />
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
export default OrganizationGroupList;