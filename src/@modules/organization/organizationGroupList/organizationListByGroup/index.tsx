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
  IObject,
  exportXLSX,
  generatePDF,
  numEnToBn,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import OrgTable from "./Table";
import { organizationPDFContent } from "./pdf";

let initPayloadMeta = {
  page: 0,
  limit: 10,
  sort: [
    {
      order: "asc",
      field: "serialNo",
    },
    {
      order: "asc",
      field: "nameEn",
    },
  ],
};

const List = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [institutionTypeList, setInstitutionTypeList] = useState<IObject[]>([]);
  const [orgTypeList, setOrgTypeList] = useState<IObject[]>([]);
  const [ministryList, setMinistryList] = useState<IObject[]>([]);

  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<any>(initPayloadMeta);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const filterBody = useRef<IObject>({});
  const updateData = useRef<IObject>({});
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

  useEffect(() => {
    getInstitutionTypesList();
    getOrganizationTypesList();
    getMinistryList();
  }, []);

  const getInstitutionTypesList = () => {
    CoreService.getByMetaTypeList("INSTITUTION_TYPE/asc")
      .then((res) => {
        setInstitutionTypeList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));
  };
  const getOrganizationTypesList = () => {
    OMSService.FETCH.organizationTypeList()
      .then((res) => {
        setOrgTypeList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));
  };

  const getMinistryList = () => {
    OMSService.getOrgByTypes("ORG_TYPE_MINISTRY,ORG_TYPE_DIVISION")
      .then((res) => {
        setMinistryList(res?.body || []);
      })
      .catch((err) => toast.error(err?.message));
  };

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta }
          : { ...respMeta, page: 0 }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        ...filterBody.current,
      },
    };

    const reqData = { ...payload, body: payload?.body };
    OMSService.getOrganizationList(reqData)
      .then((res) => {
        setListData(res?.body || []);
        setRespMeta(
          res?.meta ? { ...res?.meta } : { limit: respMeta?.limit, page: 0 }
        );
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => setIsLoading(false));
  };

  const onFilterDone = (data) => {
    filterBody.current = data;
    getDataList();
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
  };

  const handleUpdate = (data: IObject) => {
    updateData.current = data;
    setIsDrawerOpen(true);
    setIsUpdate(true);
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
    // let payload = {
    //   body: {
    //     ids: [deleteData?.id || ""],
    //   },
    // };
    // MasterDataService.trainingDelete(payload)
    //   .then((res) => {
    //     toast.success(res?.message);
    //     getDataList();
    //     setDeleteData(null);
    //   })
    //   .catch((err) => toast.error(err?.message))
    //   .finally(() => {
    //     setIsDeleteLoading(false);
    //     setIsDeleteModal(false);
    //   });
  };

  const onSubmit = (data) => {
    setIsSubmitLoading(true);
    const service = isUpdate
      ? OMSService.organizationUpdate
      : OMSService.organizationCreate;

    service(isUpdate ? { ...data, id: updateData?.current?.id || "" } : data)
      .then((res) => {
        toast.success(res?.message);
        getDataList();
        setIsDrawerOpen(false);
        setIsUpdate(false);
        updateData.current = null;
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  const onDrawerClose = () => {
    updateData.current = null;
    setIsDrawerOpen(false);
    setIsUpdate(false);
  };

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    topProgress.show();
    const payload = {
      meta: {
        page: 0,
        limit: respMeta.totalRecords,
        sort: [
          {
            order: "asc",
            field: "serialNo",
          },
          {
            order: "asc",
            field: "nameEn",
          },
        ],
      },
      body: {
        searchKey: searchKey || null,
        ...filterBody.current,
      },
    };

    OMSService.getOrganizationList(payload)
      .then((res) =>
        downloadtype === "pdf"
          ? generatePDF(organizationPDFContent(res?.body))
          : exportXLSX(exportData(res?.body || []), "Organization Type list")
      )
      .catch((err) => toast.error(err?.message))
      .finally(() => topProgress.hide());
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": numEnToBn(i + 1),
      "প্রতিষ্ঠানের নাম": d?.nameBn || COMMON_LABELS.NO_DATE,
      স্থান: d?.location?.chainBn || COMMON_LABELS.NO_DATE,
      "প্রতিষ্ঠানের পর্যায়": d?.officeTypeDTO?.titleBn || COMMON_LABELS.NO_DATE,
      "প্রতিষ্ঠানের ধরণ":
        d?.organizationTypeDTO?.nameBn || COMMON_LABELS.NO_DATE,
      "প্রতিষ্ঠানের গ্রুপ":
        d?.organizationGroupDTO?.nameBn || COMMON_LABELS.NO_DATE,
      "প্রতিষ্ঠানের অভিভাবক": d?.parent?.nameBn || COMMON_LABELS.NO_DATE,
    }));

  return (
    <>
      <PageTitle>{MENU.BN.ORANIZATION}</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>
      <div className="card p-5">
        {/* {Object.keys(filterBody.current).map((filter) => {
					if (typeof filter === "object") return <Tag title={"filter"} />;
				})} */}
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

        {!!listData?.length && (
          <div className="d-flex justify-content-between gap-3">
            <div className="text-primary text-center">
              <h5 className="mt-3">
                মোট প্রতিষ্ঠান {numEnToBn(respMeta?.totalRecords)} টি
              </h5>
            </div>
          </div>
        )}

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <OrgTable
            dataList={listData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            meta={respMeta}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </OrgTable>
          <ContentPreloader show={isLoading} />
          {!isLoading && !listData?.length && (
            <NoData details="কোনো প্রতিষ্ঠানের তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModal}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        isSubmitting={isDeleteLoading}
        onConfirmLabel={COMMON_LABELS.DELETE}
      >
        আপনি কি আসলেই <b>{deleteData?.nameBn}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default List;
