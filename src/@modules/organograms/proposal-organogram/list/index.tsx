import { TIME_PATTERN } from "@constants/common.constant";
import { MENU } from "@constants/menu-titles.constant";
import { PageTitle } from "@context/PageData";
import {
  ConfirmationModal,
  DownloadMenu,
  Input,
  Pagination,
  toast,
} from "@gems/components";
import {
  COMMON_LABELS,
  DATE_PATTERN,
  IMeta,
  IObject,
  exportXLSX,
  generateDateFormat,
  numEnToBn,
  searchParamsToObject,
  topProgress,
  useDebounce,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProposalTable from "./Table";
import { LABELS } from "./labels";

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
  // const [officeScopeList, setOfficeScopeList] = useState<IObject[]>();
  // const [proposalStatusList, setProposalStatusList] = useState<IObject[]>();
  const [respMeta, setRespMeta] = useState<IMeta>(initMeta);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const params: any = searchParamsToObject(searchParams);
  // const [officeScopeKey, setOfficeScopeKey] = useState<string>();
  // const [proposalStatusKey, setProposalStatusKey] = useState<string>();
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

  // useEffect(() => {
  //   CoreService.getByMetaTypeList("OFFICE_SCOPE/asc").then((resp) => {
  //     // Mopa: 77848f4b-3874-4cd5-b0a3-660660c046b3
  //     if (
  //       resp?.body &&
  //       resp?.body.length > 0 &&
  //       currentUser?.organizationId !== "77848f4b-3874-4cd5-b0a3-660660c046b3"
  //     ) {
  //       setOfficeScopeList(resp?.body.splice(1, 2));
  //     } else {
  //       setOfficeScopeList(resp?.body);
  //     }
  //   });

  //   CoreService.getByMetaTypeList("PROPOSAL_STATUS/asc").then((resp) =>
  //     setProposalStatusList(resp?.body)
  //   );
  // }, []);

  // const prepareFilterData = (sl: number, op: string) => {
  //   if (sl === 1) {
  //     if (op === "OFFICE_SCOPE_UNDER_OFFICE") return "UNDER";
  //     if (op === "OFFICE_SCOPE_OWN_OFFICE") return "OWN";
  //   }
  //   if (sl === 2) {
  //     if (op === "PROPOSAL_STATUS_PENDING_PROPOSAL") return "NEW";
  //     if (op === "PROPOSAL_STATUS_RESOLVED_PROPOSAL") return "RESOLVED";
  //   }
  //   return null;
  // };

  // const preparePayload = (reqMeta = null) => {
  //   return {
  //     meta: searchKey
  //       ? reqMeta
  //         ? { ...reqMeta, sort: null }
  //         : { ...respMeta, page: 0, sort: null }
  //       : reqMeta || respMeta,
  //     body:
  //       officeScopeKey && proposalStatusKey
  //         ? {
  //             officeScopeKey: officeScopeKey,
  //             status: proposalStatusKey,
  //           }
  //         : officeScopeKey
  //         ? {
  //             officeScopeKey: officeScopeKey,
  //           }
  //         : proposalStatusKey
  //         ? {
  //             status: proposalStatusKey,
  //           }
  //         : {},
  //   };
  // };

  const getDataList = (reqMeta = null) => {
    topProgress.show();
    setLoading(true);

    const payload = {
      meta: searchKey
        ? reqMeta
          ? { ...reqMeta, sort: null }
          : { ...respMeta, page: 0, sort: null }
        : reqMeta || respMeta,
      body: { searchKey: searchKey || "" },
    };

    OMSService.FETCH.organogramProposalList(payload)
      .then((resp) => {
        setDataList(resp?.body || []);
        setRespMeta(
          resp?.meta ? { ...resp?.meta } : { limit: respMeta?.limit, page: 0 }
        );
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        topProgress.hide();
        setLoading(false);
      });
  };

  const onPageChanged = (metaParams: IMeta) => {
    getDataList({ ...metaParams });
  };

  const getXLSXStoreList = (reqMeta = null) => {
    const reqData = { meta: reqMeta, body: { searchKey: searchKey } };

    OMSService.FETCH.organogramProposalList(reqData)
      .then((res) => {
        exportXLSX(exportData(res?.body || []), "Proposal list");
      })
      .catch((err) => toast.error(err?.message));
  };

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
    ProposalService.DELETE.proposedOrganogramByID(deleteData?.id)
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

  const exportData = (data: any[]) =>
    data.map((d, i) => ({
      [COMMON_LABELS.SL_NO]: numEnToBn(i + 1) || COMMON_LABELS.NOT_ASSIGN,
      [LABELS.BN.SENDER]:
        d?.proposedOrganization?.nameBn || COMMON_LABELS.NOT_ASSIGN,
      [LABELS.BN.TOPIC]:
        d?.subjects?.map((i) => i.titleBn).join(", ") ||
        COMMON_LABELS.NOT_ASSIGN,
      [LABELS.BN.STATUS]:
        d?.status === "NEW"
          ? "অপেক্ষমান"
          : d?.status || COMMON_LABELS.NOT_ASSIGN,
      [LABELS.BN.RECEIVED_DATE_TIME]:
        generateDateFormat(
          d?.proposedDate,
          DATE_PATTERN.GOVT_STANDARD + " | " + TIME_PATTERN.HM12
        ) || COMMON_LABELS.NOT_ASSIGN,
    }));

  return (
    <>
      <PageTitle> {MENU.BN.PROPOSAL_LIST} </PageTitle>
      <div className="card p-4">
        <div className="d-flex gap-3 mb-4">
          <Input
            type="search"
            noMargin
            placeholder="প্রতিষ্ঠান অনুসন্ধান করুন ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <span className="w-50">
            <Autocomplete
              placeholder="অফিসের পরিধি বাছাই করুন"
              options={officeScopeList || []}
              getOptionValue={(op) => op?.id}
              getOptionLabel={(op) => op.titleBn}
              name="officeScope"
              control={control}
              onChange={(val) =>
                setOfficeScopeKey(prepareFilterData(1, val?.metaKey) || null)
              }
            />
          </span>
          <span className="w-50">
            <Autocomplete
              placeholder="প্রস্তাবের অবস্থা বাছাই করুন"
              options={proposalStatusList || []}
              getOptionValue={(op) => op?.id}
              getOptionLabel={(op) => op.titleBn}
              name="proposalStatus"
              control={control}
              onChange={(val) =>
                setProposalStatusKey(prepareFilterData(2, val?.metaKey) || null)
              }
            />
          </span> */}
          <DownloadMenu
            className="pt-1"
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
            onDelete={onDelete}
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
      </div>
    </>
  );
};

export default ProposalList;
