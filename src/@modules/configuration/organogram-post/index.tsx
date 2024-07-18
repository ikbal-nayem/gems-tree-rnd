import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Button,
  Checkbox,
  ConfirmationModal,
  ContentPreloader,
  Input,
  NoData,
  Pagination,
  toast,
} from "@gems/components";
import { IMeta, useDebounce } from "@gems/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import OrganoPostTable from "./Table";
import { initMeta } from "@modules/post/lib";
import Form from "./From";
import { OMSService } from "@services/api/OMS.service";

const OrganoPostList = () => {
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
  const [isEnum, setIsEnum] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;

    if (isActive) params.isActive = isActive;
    else delete params.isActive;

    if (isEnum) params.isEnum = isEnum;
    else delete params.isEnum;

    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, isActive, isEnum, setSearchParams]);

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
        isEnum: isEnum ? isEnum : null,
      },
    };

    OMSService.FETCH.organogramPostList(payload)
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
    OMSService.DELETE.organogramPostDelete(payload)
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

    const payload = {
      ...data,
      id: updateData?.id || "",
      isApproved: false,
    };

    const service = isUpdate
      ? OMSService.UPDATE.organogramPostUpdate
      : OMSService.SAVE.organogramPostCreate;
    service(payload)
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
          <Checkbox label="এনাম কমিটি" 
          onChange={() => setIsEnum(!isEnum)} />
          
          <Checkbox label="সক্রিয়" 
          onChange={() => setIsActive(!isActive)} />
        </div>
        <div className="d-flex gap-3">
          <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <OrganoPostTable
            data={listData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </OrganoPostTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !listData?.length && (
            <NoData details="কোনো পদবি তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        <Form
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          onSubmit={onSubmit}
          submitLoading={isSubmitLoading}
        />
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
export default OrganoPostList;