import { IObject } from "@gems/utils";
import ManPowerList from "./ManPowerList";
import { useEffect, useState } from "react";
import { ProposalService } from "@services/api/Proposal.service";
import { Icon } from "@gems/components";
import { LABEL } from "../local-constants";

interface IForm {
  organogramId: any;
  proposedData: any;
  langEn?: boolean;
  content: "manpower" | "equipments" | "abbr" | "attached_org";
}

const ContentComparision = ({
  organogramId,
  proposedData,
  langEn,
  content,
}: IForm) => {
  const [currentData, setCurrentData] = useState<IObject>();
  const SERVICE = ProposalService.FETCH;

  useEffect(() => {
    if (organogramId)
      switch (content) {
        case "abbr":
          break;
        case "attached_org":
          break;
        case "equipments":
          break;
        case "manpower":
          // Current Manpower Data
          SERVICE.manpowerDifferenceByOrganogram(organogramId).then((resp) => {
            setCurrentData(resp?.body);
          });
          break;
      }
  }, [organogramId]);



  return (
    <div className=" card border p-3">
      <div className="row d-flex align-items-center">
        <div className="col-12 col-md-5">
          {content === "manpower" ? (
            <ManPowerList
              isLoading={false}
              // data={currentData}
              data={proposedData}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.CURRENT_MANPOWER}
            />
          ) : null}
        </div>
        <div className="col-12 col-md-2 d-none d-md-block">
          <span className="d-flex justify-content-center">
            <Icon
              icon="arrow_right_alt"
              variants="outlined"
              color="info"
              size={60}
            />
          </span>
        </div>
        <div className="col-12 d-block d-md-none px-20">
            <Icon
              icon="arrow_downward_alt"
              variants="outlined"
              color="info"
              size={60}
              className="mx-20"
            />
        </div>
        <div className="col-12 col-md-5">
          {content === "manpower" ? (
            <ManPowerList
              isLoading={false}
              data={proposedData}
              langEn={langEn}
              isTabContent={true}
              title={LABEL.PROPOSED_MANPOWER}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContentComparision;
