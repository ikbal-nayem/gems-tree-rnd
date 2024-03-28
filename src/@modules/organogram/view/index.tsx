import { Button, ContentPreloader, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NewProposalMenu } from "../components/NewProposalMenu";
import OrganogramTab from "./organogram";

const OrganogramView = () => {
  const [searchParam] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [organogramData, setOrganogramData] = useState<IObject>({});
  const [organizationId, setOrganizationId] = useState<string>();
  const [organogramId, setOrganogramId] = useState<string>(
    searchParam.get("id") || ""
  );
  const [isPreviousVerison, setIsPreviousVersion] = useState<boolean>(false);
  const [isOrgangramTab, setIsOrgangramTab] = useState<boolean>(true);
  useEffect(() => {
    if (isOrgangramTab) {
      getOrganogramDetailsById();
    } else getOrganogramVersionDetailsById();
  }, [organogramId, isOrgangramTab]);

  const getOrganogramDetailsById = () => {
    setIsLoading(true);
    OMSService.getOrganogramWithOutDeletionAdditionByOrganogramId(organogramId)
      .then((resp) => {
        setOrganogramData(resp?.body);
        if (resp?.body?.organization?.id)
          setOrganizationId(resp?.body?.organization?.id);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const getOrganogramVersionDetailsById = () => {
    setIsLoading(true);
    OMSService.getOrganogramDetailsByOrganogramId(organogramId)
      .then((resp) => {
        setOrganogramData(resp?.body);
        if (resp?.body?.organization?.id)
          setOrganizationId(resp?.body?.organization?.id);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="p-5">
      <div className="d-flex justify-content-between bg-white rounded ps-4">
        <div className="d-flex">
          <Button
            onClick={() => {
              setIsOrgangramTab(true);
              setOrganogramId(searchParam.get("id") || "");
              setIsPreviousVersion(false);
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
              {isPreviousVerison ? "ভার্সনসমূহ" : "পূর্ববর্তী ভার্সনসমূহ"}
            </span>
          </Button>
        </div>
        {!isPreviousVerison && (
          <NewProposalMenu
            organogramId={organogramId}
            organizationId={organizationId}
          />
        )}
      </div>
      <div className="mt-3">
        {isLoading && <ContentPreloader />}
        {!isLoading && !isObjectNull(organogramData) && (
          <OrganogramTab
            organogramData={organogramData}
            isPreviousVerison={isPreviousVerison}
            organogramId={organogramId}
            setOrganogramId={setOrganogramId}
          />
        )}
      </div>
    </div>
  );
};

export default OrganogramView;
