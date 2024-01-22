import { LABELS as MENU_LABEL } from "@constants/common.constant";
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
  useDebounce,
} from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import OrgForm from "./Form";
import OrgFilter from "./OrgFilter";
import OrgTable from "./Table";
import { LABELS } from "./labels";
import { MENU } from "@constants/menu-titles.constant";

let initPayloadMeta = {
  page: 0,
  limit: 10,
  sort: [
    {
      field: "serialNo",
      order: "asc",
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
  const [organizationTypeList, setOrganizationTypeList] = useState<IObject[]>(
    []
  );
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
    CoreService.getByMetaTypeList("ORG_TYPE/asc")
      .then((res) => {
        setOrganizationTypeList(res?.body || []);
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
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
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
    setIsSubmitLoading(false);
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

  const getXLSXStoreList = () =>
    exportXLSX(exportData(listData || []), "প্রতিষ্ঠানের_তালিকা");

  const exportData = (data: any[], lang: "en" | "bn" = "bn") =>
    lang === "bn"
      ? data.map((d) => ({
          [LABELS.BN.nameBn]: d?.nameBn || COMMON_LABELS.NOT_ASSIGN,
          [LABELS.BN.nameEn]: d?.nameEn || COMMON_LABELS.NOT_ASSIGN,
          [LABELS.BN.officeType]:
            d?.officeTypeDTO?.titleBn || COMMON_LABELS.NOT_ASSIGN,
          [LABELS.BN.orgType]:
            d?.orgTypeDTO?.titleBn || COMMON_LABELS.NOT_ASSIGN,
        }))
      : data.map((d) => ({
          [LABELS.EN.nameBn]: d?.nameBn || COMMON_LABELS.NOT_ASSIGN,
          [LABELS.EN.nameEn]: d?.nameEn || COMMON_LABELS.NOT_ASSIGN,
          [LABELS.EN.officeType]:
            d?.officeTypeDTO?.titleEn || COMMON_LABELS.NOT_ASSIGN,
          [LABELS.EN.orgType]:
            d?.orgTypeDTO?.titleEn || COMMON_LABELS.NOT_ASSIGN,
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
        <div className="d-flex gap-3">
          <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ... "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <OrgFilter
            options={{
              institutionTypes: institutionTypeList,
              organizationTypes: organizationTypeList,
              ministryList: ministryList,
            }}
            onFilterDone={onFilterDone}
          />
          <DownloadMenu fnDownloadExcel={getXLSXStoreList} />
        </div>

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <OrgTable
            data={listData}
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

        {/* =========================================================== Form STARTS ============================================================ */}
        <OrgForm
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          options={{
            institutionTypes: institutionTypeList,
            organizationTypes: organizationTypeList,
            ministryList: ministryList,
          }}
          updateData={updateData.current}
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
        onConfirmLabel={COMMON_LABELS.DELETE}
      >
        আপনি কি আসলেই <b>{deleteData?.nameBn}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default List;
