import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull } from "@gems/utils";
import { ProposalService } from "@services/api/Proposal.service";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProposalOrganogramEditComponent from "../components/proposed-organogram-edit-component";

const TemplateUpdate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();
  // const { state } = useLocation();

  const proposedOrganogramId = searchParam.get("id") || "";

  useEffect(() => {
    getProposedOrganogramDetailsById();
  }, []);

  const getProposedOrganogramDetailsById = () => {
    setIsLoading(true);
    ProposalService.FETCH.organogramDetailsByOrganogramId(proposedOrganogramId)
      .then((resp) => {
        setData(resp?.body);
      })
      .catch((e) => toast.error(e?.message))
      .finally(() => setIsLoading(false));
  };

  const onSubmit = (templateData) => {
    setIsSubmitLoading(true);

    let fileList =
      (templateData?.attachmentDtoList?.length > 0 &&
        templateData?.attachmentDtoList?.map((item) => {
          if (item?.fileName) return item.checkAttachmentFile;
          return undefined;
        })) ||
      [];

    let attachmentDto =
      (templateData?.attachmentDtoList?.length > 0 &&
        templateData?.attachmentDtoList?.map((item) => {
          if (item?.fileName) delete item.checkAttachmentFile;
          return item;
        })) ||
      [];

    let reqPayload = {
      ...templateData,
      attachmentDtoList: attachmentDto,
      id: proposedOrganogramId,
      isTemplate: data?.isTemplate,
      status: data?.status,
    };

    let fd = new FormData();

    fd.append("body", JSON.stringify(reqPayload));
    fileList?.length > 0 &&
      fileList.forEach((element) => {
        if (element !== undefined) fd.append("files", element);
      });

    ProposalService.UPDATE.proposalOrganogramUpdate(fd)
      .then((res) => {
        toast.success(res?.message);
        navigate(ROUTE_L2.OMS_PROPOSAL_LIST);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <>
      {isLoading && <ContentPreloader />}
      {!isLoading && !isObjectNull(data) && (
        <ProposalOrganogramEditComponent
          onSubmit={onSubmit}
          isSubmitLoading={isSubmitLoading}
          updateData={data}
        />
      )}
      {!isLoading && isObjectNull(data) && (
        <NoData
          details={"কোনো প্রস্তাবিত অর্গানোগ্রাম তথ্য খুঁজে পাওয়া যায় নি !!"}
        />
      )}
    </>
  );
};

export default TemplateUpdate;
