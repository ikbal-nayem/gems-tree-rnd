import { Button, ContentPreloader, toast } from "@gems/components";
import {
  DATE_PATTERN,
  generateDateFormat,
  IObject,
  isListNull,
  isObjectNull,
} from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OrganogramTab from "./organogram";

const OrganogramView = () => {
  const [searchParam] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organogramData, setOrganogramData] = useState<IObject>({});
  // const [organizationId, setOrganizationId] = useState<string>();
  const [organogramId, setOrganogramId] = useState<string>(
    searchParam.get("id") || ""
  );
  const [isPreviousVerison, setIsPreviousVersion] = useState<boolean>(false);
  const [isOrgangramTab, setIsOrgangramTab] = useState<boolean>(true);
  const [verisonList, setVersionList] = useState<IObject[]>([]);
  const [subVerisonList, setSubVersionList] = useState<IObject[]>([]);
  const [isBeginningVersion, setIsBeginningVersion] = useState<boolean>(false);

  useEffect(() => {
    if (organogramId) {
      if (isOrgangramTab) {
        getOrganogramDetailsById();
      } else getOrganogramVersionDetailsById();
    }
  }, [organogramId, isOrgangramTab]);

  const getOrganogramDetailsById = () => {
    setIsLoading(true);
    OMSService.getOrganogramWithOutDeletionAdditionByOrganogramId(organogramId)
      .then((resp) => {
        setOrganogramData(resp?.body);
        // if (resp?.body?.organization?.id)
        //   setOrganizationId(resp?.body?.organization?.id);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getOrganogramVersionDetailsById = () => {
    setIsLoading(true);
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => {
        setOrganogramData(resp?.body || {});
        // if (resp?.body?.organization?.id)
        //   setOrganizationId(resp?.body?.organization?.id);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isPreviousVerison && organogramId) getVersionListById();
    if (isPreviousVerison) setOrganogramId(null);
  }, [isPreviousVerison]);

  const getVersionListById = () => {
    OMSService.getVersionListByOrganogramId(organogramId)
      .then((resp) => {
        setVersionList(resp?.body);
        // if (resp?.body?.length) {
        //   setIsBeginningVersion(
        //     resp?.body.length < 2 ||
        //       resp?.body[resp?.body.length - 1]?.organogramId === organogramId
        //   );
        // }
        // setIsLatestVersion(
        //   resp?.body?.length &&
        //     (resp?.body.length < 2 ||
        //       resp?.body[0]?.organogramId === organogramId)
        // );
      })
      .catch((e) => toast.error(e?.message));
  };

  const handleVersionChange = (item) => {
    setOrganogramData(null);
    setSubVersionList([]);
    setOrganogramId(item?.organogramId);
    getSubVersionListById(item);
    setIsBeginningVersion(
      verisonList?.length &&
        verisonList[verisonList.length - 1]?.organogramId === item?.organogramId
    );
  };

  const getSubVersionListById = (versionData) => {
    const reqPayload = {
      organizationId: versionData?.organizationId,
      orgmFromDate: versionData?.organogramDate,
      orgmToDate:
        (
          !isListNull(verisonList) &&
          verisonList[
            verisonList.findIndex(
              (fd) => fd["organogramId"] === versionData?.organogramId
            ) + 1
          ]
        )?.organogramDate || null,
    };
    OMSService.FETCH.getSubVersionListByOrganogramId(reqPayload)
      .then((resp) => {
        setSubVersionList(resp?.body);
        // if (resp?.body?.length > 0) {
        //   setIsBeginningVersion(
        //     resp?.body.length < 2 ||
        //       resp?.body[resp?.body.length - 1]?.organogramId === organogramId
        //   );
        // }
        // setIsLatestVersion(
        //   resp?.body?.length &&
        //     (resp?.body.length < 2 ||
        //       resp?.body[0]?.organogramId === organogramId)
        // );
      })
      .catch((e) => toast.error(e?.message));
  };

  const handleSubVersionChange = (item) => {
    setOrganogramData(null);
    setOrganogramId(item?.organogramId);
    setIsBeginningVersion(
      subVerisonList?.length &&
        subVerisonList[subVerisonList.length - 1]?.organogramId ===
          item?.organogramId
    );
  };

  return (
    <div className="p-5">
      <div className="d-flex justify-content-between bg-white rounded ps-4">
        <div className="d-flex overflow-auto">
          <Button
            onClick={() => {
              setIsOrgangramTab(true);
              setOrganogramId(searchParam.get("id") || "");
              setIsPreviousVersion(false);
              setSubVersionList([]);
              setIsBeginningVersion(verisonList?.length > 1 ? false : true);
            }}
            className={`
              ${
                isOrgangramTab ? "border-bottom border-primary rounded-0" : ""
              } px-2`}
            variant="fill"
          >
            <span
              className={`fs-5 ${
                isOrgangramTab ? "text-primary text-bold" : ""
              }`}
            >
              অর্গানোগ্রাম
            </span>
          </Button>
          <Button
            onClick={() => {
              setIsPreviousVersion(true);
              if (!isPreviousVerison) setIsOrgangramTab(false);
            }}
            className={`
              ${
                isPreviousVerison
                  ? "border-bottom border-primary rounded-0"
                  : ""
              } px-2 ms-2`}
            variant="fill"
          >
            <span
              className={`fs-5 ${
                isPreviousVerison ? "text-primary text-bold" : ""
              }`}
            >
              {isPreviousVerison ? "ভার্সনসমূহ :" : "পূর্ববর্তী ভার্সনসমূহ"}
            </span>
          </Button>

          {isPreviousVerison &&
            verisonList?.length > 0 &&
            verisonList?.map((d, idx) => {
              return (
                <Button
                  onClick={() => handleVersionChange(d)}
                  key={idx}
                  variant="fill"
                >
                  <span
                    className={`fs-5 ${
                      organogramId === d?.organogramId ? "text-primary" : ""
                    }`}
                  >
                    {d?.organogramDate &&
                      generateDateFormat(
                        d?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )}
                  </span>
                </Button>
              );
            })}
        </div>
        {/* {!isPreviousVerison && (
          <NewProposalMenu
            organogramId={organogramId}
            organizationId={organizationId}
          />
        )} */}
      </div>
      <div className="mt-3">
        {subVerisonList?.length > 0 && (
          <div className="d-flex bg-white rounded mb-3 overflow-auto">
            {subVerisonList?.map((d, idx) => {
              return (
                <Button
                  onClick={() => handleSubVersionChange(d)}
                  key={idx}
                  variant="fill"
                >
                  <span
                    className={`fs-5 ${
                      organogramId === d?.organogramId ? "text-primary" : ""
                    }`}
                  >
                    {d?.organogramDate &&
                      generateDateFormat(
                        d?.organogramDate,
                        DATE_PATTERN.GOVT_STANDARD
                      )}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3">
        {isLoading && <ContentPreloader />}
        {!isLoading && !isObjectNull(organogramData) && organogramId && (
          <OrganogramTab
            organogramData={organogramData}
            isBeginningVersion={isBeginningVersion}
            organogramId={organogramId}
          />
        )}
      </div>
    </div>
  );
};

export default OrganogramView;
