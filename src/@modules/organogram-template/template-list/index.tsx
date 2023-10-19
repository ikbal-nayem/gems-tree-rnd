import { PageTitle } from "@context/PageData";
import {
  DownloadMenu,
  Input,
  ListDownload,
  Pagination,
  Separator,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IMeta,
  IObject,
  generateDateFormat,
  numEnToBn,
  searchParamsToObject,
  useDebounce,
} from "@gems/utils";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { downloadAsPDF } from "./downloads";
import { MENU } from "@constants/menu-titles.constant";
import TemplateTable from "./Table";

const initPayload = {
  meta: {
    page: 0,
    limit: 10,
    sort: [
      {
        order: "desc",
        field: "createdOn",
      },
    ],
  },
  body: { searchKey: "" },
};

const TemplateList = () => {
  const [dataList, setDataList] = useState<IObject[]>();
  const [respMeta, setRespMeta] = useState<IMeta>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const reqPayload = useRef(initPayload);
  const filterProps = useRef<IObject>({});
  const params: any = searchParamsToObject(searchParams);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchKey") || ""
  );
  const searchKey = useDebounce(search, 500);

  useEffect(() => {
    if (searchKey) params.searchKey = searchKey;
    else delete params.searchKey;
    setSearchParams({ ...params });
    // eslint-disable-next-line
  }, [searchKey, setSearchParams]);

  useEffect(() => {
    getDataList();
  }, [searchParams]);

  const getDataList = () => {
    // 	topProgress.show();
    // 	setLoading(true);
    // 	ReportService.getDCPromotableEmployeeList(reqPayload.current)
    // 		.then((resp) => {
    // 			setEmployeeList(resp?.body);
    // 			setRespMeta(resp?.meta);
    // 		})
    // 		.catch((err) => {
    // 			toast.error(err?.message);
    // 			setEmployeeList([]);
    // 			setRespMeta({});
    // 		})
    // 		.finally(() => {
    // 			topProgress.hide();
    // 			setLoading(false);
    // 		});
  };

  const getXLSXStoreList = (reqMeta = null) => {
    const payload = {
      meta: reqMeta ? { ...reqMeta } : { ...respMeta, page: 0, sort: null },
      body: {
        searchKey: searchKey || null,
      },
    };

    // OMSService.getInventoryList(payload)
    //   .then((res) => {
    //     exportXLSX(exportData(res?.body || []), "Template list");
    //   })
    //   .catch((err) => toast.error(err?.message))
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const exportData = (data: any[]) =>
    data.map((d) => ({
      "টেমপ্লেটের নাম": d?.inventoryTypeBn || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle> {MENU.BN.TEMPLATE_LIST} </PageTitle>
      <div className="card p-4">
        {/* <Filter onFilter={onFilter} /> */}
        {/* <Separator /> */}
        <div className="d-flex gap-3 mb-4">
          <Input
            type="search"
            noMargin
            placeholder="টেমপ্লেটের নাম অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ListDownload
            fnDownloadExcel={() =>
              getXLSXStoreList({
                page: 0,
                limit: respMeta?.totalRecords || 0,
              })
            }
            // fnDownloadPDF={() =>
            //   downloadAsPDF(reqPayload.current, respMeta?.totalRecords)
            // }
          />
        </div>
        {!!dataList?.length && (
          <div className="d-flex justify-content-between gap-3">
            <div className="text-primary text-center">
              <h5 className="my-3">
                মোট টেমপ্লেট {numEnToBn(respMeta?.totalRecords)} টি
              </h5>
            </div>
          </div>
        )}

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="p-4">
          <TemplateTable
              dataList={dataList}
            // dataList={[
            //   { version: "name A" },
            //   { version: "name B" },
            // ]}
            respMeta={respMeta}
            isLoading={isLoading}
          >
            <Pagination meta={respMeta} pageNeighbours={2} setSearchParams />
          </TemplateTable>
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}
      </div>
    </>
  );
};

export default TemplateList;
