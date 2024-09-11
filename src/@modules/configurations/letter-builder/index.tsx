import { MENU } from "@constants/menu-titles.constant";
import { PageTitle, PageToolbarRight } from "@context/PageData";
import {
  Button,
  ConfirmationModal,
  ContentPreloader,
  Input,
  NoData,
  Pagination,
  toast,
} from "@gems/components";
import { IMeta, numEnToBn, useDebounce } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import Form from "./Form";
import DataTable from "./Table";

const initMeta: IMeta = {
  page: 0,
  limit: 20,
};

const LetterBuilder = () => {
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

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  useEffect(() => {
    getDataList();
  }, []);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [searchParams]);

  const getDataList = (reqMeta = null) => {
    const reqPayload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
      },
    };
    OMSService.FETCH.organogramApproverList(reqPayload)
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
    OMSService.DELETE.organogramApprover([deleteData?.id])
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
        }
      : data;

    const service = isUpdate
      ? OMSService.UPDATE.organogramApprover
      : OMSService.SAVE.organogramApprover;
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

  return (
    <>
      <PageTitle>{MENU.BN.LETTER_BUILDER}</PageTitle>
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
        </div>
        {!!listData?.length && (
          <div className="d-flex justify-content-between gap-3">
            <h5 className="mt-3">
              <div className="d-flex justify-content">
                মোট লেটার:
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
            <NoData details="কোনো লেটার বিল্ডার তথ্য পাওয়া যায়নি!" />
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
        আপনি কি আসলেই লেটার
        <b> {deleteData?.title || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default LetterBuilder;
