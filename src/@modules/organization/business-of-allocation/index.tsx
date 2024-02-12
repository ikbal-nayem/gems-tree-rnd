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
  Select,
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
import Form from "./Form";
import DataTable from "./Table";
import { organizationTypePDFContent } from "./pdf";
import WorkSpaceComponent from "./WorkSpaceComponent";
import { useAuth } from "@context/Auth";

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

const BusinessOfAllocation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>({});
  const [organization, setOrganization] = useState<IObject>();
  const formProps = useForm();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = formProps;

  const { currentUser } = useAuth();

  useEffect(() => {
    setOrganization(currentUser?.organization);
    getDataList();
  }, []);

  // const getOrganizationTypesList = () => {
  //   OMSService.FETCH.organizationTypeList()
  //     .then((res) => {
  //       setOrgTypeList(res?.body || []);
  //     })
  //     .catch((err) => toast.error(err?.message));
  // };

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: reqMeta || respMeta,
      body: {},
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

  const onCustomSelection = (organization) => {
    setOrganization(
      organization
        ? {
            id: organization?.id,
            nameBn: organization?.nameBn,
          }
        : null
    );
    console.log("index Organization : ", organization);
  };

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    downloadtype === "pdf"
      ? generatePDF(organizationTypePDFContent(listData))
      : exportXLSX(exportData(listData || []), "Organization Type list");
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
        {MENU.BN.BUSINESS_OF_ALLOCATION_LIST +
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
        <div className="row">
          <div className="col-12 col-md-6">
            <WorkSpaceComponent
              {...formProps}
              isRequired="প্রতিষ্ঠান বাছাই করুন"
              organization={organization}
              onCustomSelection={onCustomSelection}
            />
          </div>
          <div className="col-10 col-md-5">
            <Select
              label="অর্গানোগ্রাম তারিখ"
              // options={organogramDateList || []}
              options={[]}
              placeholder="অর্গানোগ্রাম তারিখ বাছাই করুন"
              noMargin
              textKey={"titleBn"}
              valueKey="key"
              registerProperty={{
                ...register(`organogramDate`, {
                  required: true,
                }),
              }}
              isDisabled={updateData?.organogramDate}
              isError={!!errors?.organogramDate}
              errorMessage={errors?.organogramDate?.message as string}
            />
          </div>
          <div className="col-2 col-md-1 pt-7">
            <DownloadMenu
              fnDownloadExcel={() => downloadFile("excel")}
              fnDownloadPDF={() => downloadFile("pdf")}
            />
          </div>
        </div>

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

        {/* =========================================================== Form STARTS ============================================================ */}
        {/* <Form
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
          updateData={updateData}
          onSubmit={onSubmit}
          submitLoading={isSubmitLoading}
        /> */}
        {/* =========================================================== FORM ENDS============================================================ */}
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
export default BusinessOfAllocation;
