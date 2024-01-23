import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import {
  Autocomplete,
  ConfirmationModal,
  Input,
  DownloadMenu,
  Pagination,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  IMeta,
  IObject,
  exportXLSX,
  numEnToBn,
  searchParamsToObject,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TemplateTable from "./Table";
import { CoreService } from "@services/api/Core.service";
import { useForm } from "react-hook-form";

const initMeta: IMeta = {
  page: 0,
  limit: 10,
  sort: [
    {
      order: "desc",
      field: "createdOn",
    },
  ],
};

const TemplateList = () => {
  const [dataList, setDataList] = useState<IObject[]>();
  const [organizationTypesList, setOrganizationTypesList] =
    useState<IObject[]>();
  const [orgType, setOrgType] = useState<string>();
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const params: any = searchParamsToObject(searchParams);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const searchKey = useDebounce(search, 500);

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const formProps = useForm();
  const { control } = formProps;

  useEffect(() => {
    CoreService.getByMetaTypeList("ORG_TYPE/asc").then((resp) =>
      setOrganizationTypesList(resp?.body)
    );
  }, []);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  useEffect(() => {
    getDataList();
  }, [searchParams, orgType]);

  const onCancelDelete = () => {
    setIsDeleteModal(false);
    setDeleteData(null);
  };

  const onDelete = (data) => {
    setIsDeleteModal(true);
    setDeleteData(data);
  };

  const onConfirmDelete = () => {
    setIsDeleteLoading(true);
    OMSService.DELETE.organogramByID(deleteData?.id)
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

  const getDataList = (reqMeta = null) => {
    topProgress.show();
    setLoading(true);

    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: {
        isTemplate: true,
        searchKey: searchKey || null,
        orgTypeKey: orgType || null,
      },
    };

    const reqData = { ...payload, body: payload?.body };

    OMSService.getTemplateList(reqData)
      .then((resp) => {
        setDataList(resp?.body || []);
        setRespMeta(
          resp?.meta ? { ...resp?.meta } : { limit: respMeta?.limit, page: 0 }
        );
      })
      .catch((err) => {
        toast.error(err?.message);
      })
      .finally(() => {
        topProgress.hide();
        setLoading(false);
      });
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
  };

  const getXLSXStoreList = (reqMeta = null) => {
    const payload = {
      meta: reqMeta ? { ...reqMeta } : { ...respMeta, page: 0, sort: null },
      body: {
        searchKey: searchKey || null,
        isTemplate: true,
      },
    };

    OMSService.getTemplateList(payload)
      .then((res) => {
        exportXLSX(exportData(res?.body || []), "Template list");
      })
      .catch((err) => toast.error(err?.message));
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      [COMMON_LABELS.SL_NO]: numEnToBn(i + 1) || COMMON_LABELS.NOT_ASSIGN,
      "টেমপ্লেটের নাম (বাংলা)": d?.titleBn || COMMON_LABELS.NOT_ASSIGN,
      "টেমপ্লেটের নাম (ইংরেজি)": d?.titleEn || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle> {MENU.BN.TEMPLATE_LIST} </PageTitle>
      <div className="card p-4">
        {/* <Filter onFilter={onFilter} /> */}
        {/* <Separator /> */}
        <div className="d-flex justify-content-between gap-2 mb-2">
          <span className="w-25">
            <Autocomplete
              placeholder="প্রতিষ্ঠানের ধরণ বাছাই করুন"
              options={organizationTypesList || []}
              getOptionLabel={(op) => op.titleBn}
              getOptionValue={(op) => op.metaKey}
              name="orgType"
              control={control}
              onChange={(op) => setOrgType(op?.metaKey)}
            />
          </span>
          <Input
            type="search"
            noMargin
            placeholder="টেমপ্লেটের নাম অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DownloadMenu
            fnDownloadExcel={() =>
              getXLSXStoreList({
                page: 0,
                limit: respMeta?.totalRecords || 0,
              })
            }
            // fnDownloadPDF={() =>
            //   downloadAsPDF(reqPayload.current, respMeta?.totalRecords)
            // }
          />
        </div>
        {!!dataList?.length && (
          <div className="d-flex justify-content-between gap-3">
            <div className="text-primary text-center">
              <h5 className="mt-3">
                মোট টেমপ্লেট {numEnToBn(respMeta?.totalRecords)} টি
              </h5>
            </div>
          </div>
        )}

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="px-4 pb-4">
          <TemplateTable
            dataList={dataList}
            getDataList={getDataList}
            respMeta={respMeta}
            isLoading={isLoading}
            onDelete={onDelete}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </TemplateTable>
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}
        <ConfirmationModal
          isOpen={isDeleteModal}
          onClose={onCancelDelete}
          onConfirm={onConfirmDelete}
          isSubmitting={isDeleteLoading}
          onConfirmLabel={"মুছে ফেলুন"}
        >
          আপনি কি আসলেই <b>{deleteData?.titleBn || null}</b> মুছে ফেলতে চাচ্ছেন
          ?
        </ConfirmationModal>
      </div>
    </>
  );
};

export default TemplateList;
