import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import { Input, Pagination, toast } from "@gems/components";
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
import { useSearchParams } from "react-router-dom";
import ProposalTable from "./Table";

const initMeta: IMeta = {
  page: 0,
  limit: 10,
  sort: [
    {
      order: "desc",
      field: "createdOn",
    },
  ],
};

const ProposalList = () => {
  const [dataList, setDataList] = useState<IObject[]>();
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
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

  const getDataList = (reqMeta = null) => {
    topProgress.show();
    setLoading(true);

    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: {
        searchKey: searchKey || null,
        isTemplate: false,
      },
    };

    const reqData = { ...payload, body: payload?.body };

    OMSService.getTemplateList(reqData)
      .then((resp) => {
        setDataList(resp?.body || []);
        setRespMeta(
          resp?.meta ? { ...resp?.meta } : { limit: respMeta?.limit, page: 0 }
        );
        setDataList([
          {
            id: "asd-asda-sdsad",
            organization: {
              id: "wwwww-aaaa-yyyyyy",
              nameBn: "জনপ্রশাসন মন্ত্রণালয়",
              nameEn: "Ministry Of Public Administration",
            },
            actionType: {
              id: "weq-asc-889-weqe",
              titleBn: "পদ-সৃজন",
              titleEn: "Post Creation",
            },
            receivedOn: 1701927381134,
          },
          {
            id: "ff-ss-rrrrr",
            organization: {
              id: "ccccc-vvvv-aaaaa",
              nameBn: "স্বাস্থ্য শিক্ষা ও পরিবার কল্যাণ বিভাগ",
              nameEn: "Medical Education And Family Welfare Division",
            },
            actionType: {
              id: "weq-asc-889-weqe",
              titleBn: "পদ-বিলুপ্ত করন",
              titleEn: "Post Deletation",
            },
            receivedOn: 1701827381134,
          },
        ]);
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
      <PageTitle> {MENU.BN.PROPOSAL_LIST} </PageTitle>
      <div className="card p-4">
        {/* <Filter onFilter={onFilter} /> */}
        {/* <Separator /> */}
        <div className="d-flex gap-3 mb-4">
          <Input
            type="search"
            noMargin
            placeholder="প্রেরকের নাম অনুসন্ধান করুন ..."
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
                মোট প্রস্তাব {numEnToBn(respMeta?.totalRecords)} টি
              </h5>
            </div>
          </div>
        )}

        {/* ============================================================ TABLE STARTS ============================================================ */}

        <div className="p-4">
          <ProposalTable
            dataList={dataList}
            // dataList={[
            //   { version: "name A" },
            //   { version: "name B" },
            // ]}
            respMeta={respMeta}
            isLoading={isLoading}
          >
            <Pagination
              meta={respMeta}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
            />
          </ProposalTable>
        </div>

        {/* ============================================================ TABLE ENDS ============================================================ */}
      </div>
    </>
  );
};

export default ProposalList;
