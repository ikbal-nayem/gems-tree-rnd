import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import { ConfirmationModal, Input, Pagination, toast } from "@gems/components";
import {
  IMeta,
  IObject,
  numEnToBn,
  searchParamsToObject,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrganogramTable from "./Table";
import { ROUTE_L1 } from "@constants/internal-route.constant";
import DraftCloneModal from "./draftCloneModal";

const initMeta: IMeta = {
  page: 0,
  limit: 20,
  sort: [
    {
      order: "desc",
      field: "createdOn",
    },
  ],
};

const OrganogramList = ({ status }) => {
  const [dataList, setDataList] = useState<IObject[]>();
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDraftCloneOpen, setIsDraftCloneOpen] = useState<boolean>(false);
  const [draftCloneData, setDraftCloneData] = useState<IObject>({});
  const params: any = searchParamsToObject(searchParams);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const searchKey = useDebounce(search, 500);
  const navigate = useNavigate();

  let service, title;
  switch (status) {
    case "draft":
      service = OMSService.FETCH.draftOrganogramList;
      title = MENU.BN.ORGANOGRAM_LIST_DRAFT;
      break;
    case "inreview":
      service = OMSService.FETCH.inReviewOrganogramList;
      title = MENU.BN.ORGANOGRAM_LIST_INREVIEW;
      break;
    case "inapprove":
      service = OMSService.FETCH.inApproveOrganogramList;
      title = MENU.BN.ORGANOGRAM_LIST_INAPPROVE;
      break;
    default:
      navigate(ROUTE_L1.DASHBOARD);
  }

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  useEffect(() => {
    getDataList();
  }, [searchParams]);

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
    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        isTemplate: 1,
      },
    };

    const reqData = { ...payload, body: payload?.body };

    topProgress.show();
    setLoading(true);
    service(reqData)
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

  const onDraftClone = (item: IObject) => {
    setDraftCloneData(item);
    setIsDraftCloneOpen(true);
  };

  const onDraftCloneClose = () => {
    setDraftCloneData({});
    setIsDraftCloneOpen(false);
  };

  // const getXLSXStoreList = (reqMeta = null) => {
  //   const payload = {
  //     meta: reqMeta ? { ...reqMeta } : { ...respMeta, page: 0, sort: null },
  //     body: {
  //       searchKey: searchKey || null,
  //     },
  //   };

  //   OMSService.getOrganizationOrganogramList(payload)
  //     .then((res) => {
  //       exportXLSX(exportData(res?.body || []), "Template list");
  //     })
  //     .catch((err) => toast.error(err?.message));
  // };

  // const exportData = (data: any[]) =>
  //   data.map((d, i) => ({
  //     [COMMON_LABELS.SL_NO]: numEnToBn(i + 1) || COMMON_LABELS.NOT_ASSIGN,
  //     [LABELS.NAME]: d?.titleBn || COMMON_LABELS.NOT_ASSIGN,
  //     [LABELS.ORGANIZATION_NAME]: d?.titleEn || COMMON_LABELS.NOT_ASSIGN,
  //     [LABELS.VERSION]: d?.titleBn || COMMON_LABELS.NOT_ASSIGN,
  //   }));

  return (
    <>
      <PageTitle> {title} </PageTitle>
      <div className="card p-4">
        {/* <Filter onFilter={onFilter} /> */}
        {/* <Separator /> */}
        <div className="d-flex gap-3 mb-4">
          <Input
            type="search"
            noMargin
            placeholder="অর্গানোগ্রামের নাম অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <ListDownload
            fnDownloadExcel={() =>
              getXLSXStoreList({
                page: 0,
                limit: respMeta?.totalRecords || 0,
              })
            }
            fnDownloadPDF={() =>
              downloadAsPDF(reqPayload.current, respMeta?.totalRecords)
            }
          /> */}
        </div>
        {!!dataList?.length && (
          <div className="d-flex justify-content-between gap-3">
            <div className="text-primary text-center">
              <h5 className="my-3">
                মোট অর্গানোগ্রাম {numEnToBn(respMeta?.totalRecords)} টি
              </h5>
            </div>
          </div>
        )}

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="p-4">
          <OrganogramTable
            dataList={dataList}
            // getDataList={getDataList}
            respMeta={respMeta}
            isLoading={isLoading}
            onDelete={onDelete}
            onDraftClone={onDraftClone}
            status={status}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </OrganogramTable>
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

        <DraftCloneModal
          isOpen={isDraftCloneOpen}
          onClose={onDraftCloneClose}
          draftCloneData={draftCloneData}
          getDataList={getDataList}
        />
      </div>
    </>
  );
};

export default OrganogramList;
