import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Button,
  ConfirmationModal,
  ContentPreloader,
  Input,
  ListDownload,
  NoData,
  Pagination,
  toast,
  topProgress,
} from "@gems/components";
import {
  COMMON_LABELS,
  IMeta,
  IMetaKeyResponse,
  IObject,
  META_TYPE,
  exportXLSX,
  initPayloadMeta,
  makeBoolean,
  searchParamsToObject,
  useDebounce,
} from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "./Filter";
import Form from "./Form";
import Table from "./Table";
import { MENU } from "@constants/menu-titles.constant";

type IOptions = {
  orgList: IMetaKeyResponse[];
  postList: IMetaKeyResponse[];
  serviceList: IMetaKeyResponse[];
  cadreList: IMetaKeyResponse[];
  gradeList: IMetaKeyResponse[];
};

const initPayload = {
	meta: {
		page: 0,
		limit: 25,
		sort: [{ order: "asc", field: "serialNo" }],
	},
	body: { searchKey: "" },
};

const PostConfig = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<IMeta>(initPayloadMeta);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const [isEntryRankFilterKey] = useState<string>(
    searchParams.get("isEntryRank") || ""
  );
  const [options, setOptions] = useState<IOptions>();
  const filterBody = useRef<IObject>({});
  const [updateData, setUpdateData] = useState<any>({});
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);

  useEffect(() => {
    const req1 = OMSService.getOrganizationList(initPayload);
    const req2 = OMSService.getPostList();
    const req3 = CoreService.getByMetaTypeList(META_TYPE.SERVICE_TYPE);
    const req4 = CoreService.getByMetaTypeList(META_TYPE.CADRE);
    const req5 = CoreService.getGrades();

    Promise.all([req1, req2, req3, req4, req5])
      .then(([res1, res2, res3, res4, res5]) => {
        setOptions({
          orgList: res1?.body,
          postList: res2?.body,
          serviceList: res3?.body,
          cadreList: res4?.body,
          gradeList: res5?.body,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    if (isEntryRankFilterKey) params.isEntryRank = isEntryRankFilterKey;
    else delete params.isEntryRank;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, isEntryRankFilterKey, setSearchParams]);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [searchParams]);

  // console.log(filterBody.current);

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

    const reqData = { ...payload, body: makeBoolean(payload?.body) };

    // MasterDataService.getRankMinistryConfigList(reqData)
      // .then((res) => {
      //   setListData(res?.body || []);
      //   setRespMeta(
      //     res?.meta ? { ...res?.meta } : { limit: respMeta?.limit, page: 0 }
      //   );
      // })
      // .catch((err) => toast.error(err?.message))
      // .finally(() => {
      //   setIsLoading(false);
      // });
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
  };

  const onFilterDone = (data) => {
    filterBody.current = data;
    getDataList();
  };

  const onDrawerClose = () => {
    setIsDrawerOpen(false);
    setUpdateData({});
  };

  const handleUpdate = (data: any) => {
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
    // MasterDataService.rankMinistryDelete(payload)
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
  //   topProgress.show();
  //   const service = data?.id
  //     ? MasterDataService.rankMinistryUpdate
  //     : MasterDataService.rankMinistryCreate;
  //   service(data)
  //     .then((res) => {
  //       toast.success(res?.message);
  //       getDataList();
  //       setIsDrawerOpen(false);
  //       setUpdateData({});
  //     })
  //     .catch((error) => toast.error(error?.message))
  //     .finally(() => {
  //       setIsSubmitLoading(false);
  //       topProgress.hide();
  //     });
  };

  const getXLSXStoreList = () => {
    const reqMeta = {
      page: 0,
      limit: respMeta?.totalRecords || 0,
      sort: [
        {
          order: "desc",
          field: "createdOn",
        },
      ],
    };

    const payload = {
      meta: { ...reqMeta },
      body: {
        searchKey: searchKey || null,
        isEntryRank: isEntryRankFilterKey || null,
      },
    };
    const reqData = { ...payload, body: makeBoolean(payload?.body) };

    // MasterDataService.getRankMinistryConfigList(reqData)
    //   .then((res) => {
    //     exportXLSX(exportData(res?.body || []), MENU.EN.POST_CONFIFUE);
    //   })
    //   .catch((err) => toast.error(err?.message))
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const exportData = (data: any[]) =>
    data.map((d) => ({
      পদ: d?.rank?.titleBn || COMMON_LABELS.NOT_ASSIGN,
      "পদের ধরণ": d?.isEntryRank ? "প্রারম্ভিক পদ" : "",
      মন্ত্রণালয়: d?.ministry?.nameBn || COMMON_LABELS.NOT_ASSIGN,
      "সার্ভিস/ক্যাডারের ধরণ":
        d?.serviceType?.titleBn || COMMON_LABELS.NOT_ASSIGN,
      "সার্ভিস/ক্যাডারের নাম": d?.cadre?.titleBn || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>{MENU.BN.POST_CONFIG}</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>
      <div className="card p-5">
        <div className="d-flex gap-3">
          <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Filter onFilterDone={onFilterDone} options={options} />
          <ListDownload fnDownloadExcel={getXLSXStoreList} />
        </div>

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <Table
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
          </Table>
          <ContentPreloader show={isLoading} />
          {!isLoading && !listData?.length && (
            <NoData details="কোনো পদের নাম তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}

        {/* =========================================================== Form STARTS ============================================================ */}
        <Form
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          onSubmit={onSubmit}
          options={options}
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
export default PostConfig;
