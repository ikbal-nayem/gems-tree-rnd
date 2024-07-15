import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Button,
  Checkbox,
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
  META_TYPE,
  exportXLSX,
  useDebounce,
} from "@gems/utils";
import { CoreService } from "@services/api/Core.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import Form from "./Form";
import PostTable from "./Table";
import { IOptions, initMeta } from "./lib";

const Post = () => {
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
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);
  const [options, setOptions] = useState<IOptions>();
  const [isEnamCommittee, setIsEnamCommittee] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const req1 = CoreService.getGrades();
    const req2 = CoreService.getByMetaTypeList(META_TYPE.SERVICE_TYPE);
    const req3 = CoreService.getByMetaTypeList(META_TYPE.CADRE);

    Promise.all([req1, req2, req3])
      .then(([res1, res2, res3]) => {
        setOptions({
          gradeList: res1?.body,
          serviceList: res2?.body,
          cadreList: res3?.body,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;

    if (isActive) params.isActive = isActive;
    else delete params.isActive;

    if (isEnamCommittee) params.isEnamCommittee = isEnamCommittee;
    else delete params.isEnamCommittee;

    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, isActive, isEnamCommittee, setSearchParams]);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [searchParams]);

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        isActive: isActive ? isActive : null,
        isEnamCommittee: isEnamCommittee ? isEnamCommittee : null,
      },
    };

    CoreService.getCorePostList(payload)
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
    CoreService.postDelete(payload)
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

    const service = isUpdate ? CoreService.postUpdate : CoreService.postCreate;

    service(isUpdate ? { ...data, id: updateData?.id || "" } : data)
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

  const getXLSXStoreList = () => {
    const reqMeta = {
      page: 0,
      limit: respMeta?.totalRecords || 0,
      sort: [
        {
          order: "asc",
          field: "nameEn",
        },
      ],
    };
    const payload: any = {
      meta: reqMeta ? { ...reqMeta } : { ...respMeta, page: 0, sort: null },
      body: {
        searchKey: searchKey || null,
      },
    };

    CoreService.getPostList(payload)
      .then((res) => {
        exportXLSX(exportData(res?.body || []), "Post data list");
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const exportData = (data: any[]) =>
    data.map((d) => ({
      "নাম (বাংলা)": d?.nameBn || COMMON_LABELS.NOT_ASSIGN,
      "নাম (ইংরেজি)": d?.nameEn || COMMON_LABELS.NOT_ASSIGN,
      "সার্ভিস/ক্যাডারের ধরণ":
        d?.serviceType?.titleBn || COMMON_LABELS.NOT_ASSIGN,
      "সার্ভিস/ক্যাডারের নাম": d?.cadre?.titleBn || COMMON_LABELS.NOT_ASSIGN,
      গ্রেড: d?.grade?.nameBn || COMMON_LABELS.NOT_ASSIGN,
      কোড: d?.code || COMMON_LABELS.NOT_ASSIGN,
      সক্রিয়: d?.isActive ? "হ্যাঁ" : "না" || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle>পদবি</PageTitle>
      <PageToolbarRight>
        <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
          যুক্ত করুন
        </Button>
      </PageToolbarRight>
      <div className="card p-5">
        <div className=" d-flex col-12 gap-4">
          <Checkbox
            label="এনাম কমিটি"
            onChange={() => setIsEnamCommittee(!isEnamCommittee)}
          />
          <Checkbox label="সক্রিয়" onChange={() => setIsActive(!isActive)} />
        </div>
        <div className="d-flex gap-3">
          <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DownloadMenu fnDownloadExcel={getXLSXStoreList} />
        </div>

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <PostTable
            data={listData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </PostTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !listData?.length && (
            <NoData details="কোনো পদবি তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}

        {/* =========================================================== Form STARTS ============================================================ */}
        <Form
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          options={options}
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
export default Post;
