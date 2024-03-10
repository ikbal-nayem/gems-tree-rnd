import { ROUTE_L2 } from "@constants/internal-route.constant";
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
  DATE_PATTERN,
  IMeta,
  exportXLSX,
  generateDateFormat,
  generatePDF,
  notNullOrUndefined,
  numEnToBn,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utility/makeObject";
import DataTable from "./Table";
import { organizationTypePDFContent } from "./pdf";

const initMeta: IMeta = {
  page: 0,
  limit: 200,
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

const OrganogramNodeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);
  const { state } = useLocation();
  const [organogram] = useState<any>(state);
  const navigate = useNavigate();

  const orgName = organogram?.isEnamCommittee
    ? organogram?.organizationNameEn
    : organogram?.organizationNameBn;

  const organogramDate =
    organogram?.organogramDate &&
    generateDateFormat(organogram?.organogramDate, DATE_PATTERN.GOVT_STANDARD);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params }, { state: state });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  useEffect(() => {
    // setOrganogram(searchParams.get("state"));
    getDataList();
    // eslint-disable-next-line
  }, [searchParams]);

  const getDataList = (reqMeta = null) => {
    if (notNullOrUndefined(organogram)) {
      const payload = {
        meta: searchKey
          ? reqMeta
            ? { ...reqMeta, sort: null }
            : { ...respMeta, page: 0, sort: null }
          : reqMeta || respMeta,
        body: {
          searchKey: searchKey || null,
          organizationOrganogramId: organogram?.id,
        },
      };

      OMSService.FETCH.organogramNodeList(payload)
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
    }
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
  };

  const handleUpdate = (id: string) => {
    navigate(ROUTE_L2.ORG_TEMPLATE_NODE_UPDATE + "?id=" + id, {
      state: organogram,
    });
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
    OMSService.DELETE.organogramNodeDeleteById(deleteData?.id || "")
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

  const downloadFile = (downloadtype: "excel" | "pdf") => {
    downloadtype === "pdf"
      ? generatePDF(
          organizationTypePDFContent(
            listData,
            orgName + " (" + organogramDate + ") এর পদবি/স্তরের তালিকা",
            organogram?.isEnamCommittee
          )
        )
      : exportXLSX(
          exportData(listData || []),
          orgName + " (" + organogramDate + ") এর পদবি/স্তরের তালিকা"
        );
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": i + 1,
      "পদবি/স্তর":
        (organogram?.isEnamCommittee ? d?.titleEn : d?.titleBn) ||
        COMMON_LABELS.NOT_ASSIGN,
      অভিভাবক:
        (organogram?.isEnamCommittee
          ? d?.parentNodeDto?.titleEn
          : d?.parentNodeDto?.titleBn) || COMMON_LABELS.NOT_ASSIGN,
      জনবল: numEnToBn(d?.nodeManpower) || COMMON_LABELS.NOT_ASSIGN,
    }));
    
  return (
    <>
      <PageTitle>
        {MENU.BN.NODE_LIST +
          (notNullOrUndefined(respMeta?.totalRecords)
            ? " (মোট : " + numEnToBn(respMeta?.totalRecords) + " টি)"
            : "")}
        <br />
        {notNullOrUndefined(organogram) && (
          <span className="fs-6 mt-2 text-gray-600">
            প্রতিষ্ঠান :{" " + orgName + " | "}
            অর্গানোগ্রাম তারিখ :{" " + organogramDate}
          </span>
        )}
      </PageTitle>

      {notNullOrUndefined(organogram) && (
        <PageToolbarRight>
          <Button
            color="primary"
            onClick={() =>
              navigate(ROUTE_L2.ORG_TEMPLATE_NODE_CREATE, {
                state: organogram,
              })
            }
          >
            যুক্ত করুন
          </Button>
        </PageToolbarRight>
      )}
      <div className="card p-5">
        <div className="d-flex gap-3">
          <Input
            type="search"
            noMargin
            placeholder="অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {respMeta.totalRecords && (
            <DownloadMenu
              fnDownloadExcel={() => downloadFile("excel")}
              fnDownloadPDF={() => downloadFile("pdf")}
            />
          )}
        </div>

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="mt-3">
          <DataTable
            data={listData}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            organogram={organogram}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </DataTable>
          {isLoading && <ContentPreloader />}
          {!isLoading && !listData?.length && (
            <NoData details="কোনো তথ্য পাওয়া যায়নি!" />
          )}
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModal}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        isSubmitting={isDeleteLoading}
        onConfirmLabel={"মুছে ফেলুন"}
      >
        আপনি কি আসলেই <b>{deleteData?.titleBn || null}</b> মুছে ফেলতে চাচ্ছেন ?
      </ConfirmationModal>
    </>
  );
};
export default OrganogramNodeList;
