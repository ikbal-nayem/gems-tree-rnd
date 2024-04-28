import { PageTitle } from "@context/PageData";
import {
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
  exportXLSX,
  generatePDF,
  numEnToBn,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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

const OrgListByGroup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [listData, setListData] = useState<any>([]);
  const [respMeta, setRespMeta] = useState<any>(initPayloadMeta);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const params: any = searchParamsToObject(searchParams);
  const searchKey = useDebounce(search, 500);
  const { state } = useLocation();
  const groupId = searchParams.get("groupId") || null;

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params }, { state: state });
    // eslint-disable-next-line
  }, [searchKey]);

  useEffect(() => {
    getDataList();
    // eslint-disable-next-line
  }, [groupId, searchParams]);

  const getDataList = (reqMeta = null) => {
    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta }
          : { ...respMeta, page: 0 }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        orgCategoryGroupId: groupId || null,
      },
    };

    const reqData = { ...payload, body: payload?.body };
    OMSService.getOrganizationCustomList(reqData)
      .then((res) => {
        setListData(res?.body || []);
        setRespMeta(
          res?.meta ? { ...res?.meta } : { limit: respMeta?.limit, page: 0 }
        );
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => setIsLoading(false));
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
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
        orgCategoryGroupId: groupId || null,
      },
    };

    OMSService.getOrganizationCustomList(payload)
      .then((res) =>
        downloadtype === "pdf"
          ? generatePDF(organizationPDFContent(res?.body))
          : exportXLSX(
              exportData(res?.body || []),
              "Organization list by Group"
            )
      )
      .catch((err) => toast.error(err?.message))
      .finally(() => topProgress.hide());
  };

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      "ক্রমিক নং": numEnToBn(i + 1),
      "প্রতিষ্ঠানের নাম": d?.nameBn || "-",
      স্থান: d?.locationChainNameBn || "-",
      "প্রতিষ্ঠানের পর্যায়": d?.orgLevelBn || "-",
      "প্রতিষ্ঠানের ধরন": d?.orgCategoryTypeBn || "-",
      "প্রতিষ্ঠানের গ্রুপ": d?.orgCategoryGroupBn || "-",
      "প্রতিষ্ঠানের অভিভাবক": d?.parentOrgNameBn || "-",
    }));

  return (
    <>
      <PageTitle>{state?.groupName + " গ্রুপের প্রতিষ্ঠানের তালিকা"}</PageTitle>
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
          <OrgTable dataList={listData} meta={respMeta}>
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
    </>
  );
};
export default OrgListByGroup;
