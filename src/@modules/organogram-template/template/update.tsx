import { ROUTE_L2 } from "@constants/internal-route.constant";
import { ContentPreloader, NoData, toast } from "@gems/components";
import { IObject, isObjectNull, notNullOrUndefined } from "@gems/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { isNotEmptyList } from "utility/utils";
import { OMSService } from "../../../@services/api/OMS.service";
import TemplateComponent from "../components/templateComponent";
import TemplateEditComponent from "../components/templateEditComponent";

const TemplateUpdate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [data, setData] = useState<IObject>({});
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const organizationId = state?.organizationId || null;

  const templateId = searchParam.get("id") || "";

  useEffect(() => {
    getTemplateDetailsDetailsById();
  }, []);

  const getTemplateDetailsDetailsById = () => {
    setIsLoading(true);
    OMSService.getTemplateDetailsByTemplateId(templateId)
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
      id: templateId,
      isTemplate: data?.isTemplate,
      status: data?.status,
    };

    let fd = new FormData();

    fd.append("body", JSON.stringify(reqPayload));
    fileList?.length > 0 &&
      fileList.forEach((element) => {
        if (element !== undefined) fd.append("files", element);
      });

    OMSService.templateUpdate(fd)
      .then((res) => {
        toast.success(res?.message);
        if (isNotEmptyList(templateData?.templateOrganizationsDtoList)) {
          if (reqPayload?.id) {
            OMSService.getAttachedOrganizationByTemplateId(reqPayload?.id)
              .then((resp) => {
                if (!notNullOrUndefined(resp?.body) || resp?.body?.length < 1) {
                  toast.warning("কোন প্রতিষ্ঠান সংযুক্ত করা হয় নি ...");
                  return;
                }
                if (resp?.body?.length === 1) {
                  navigate(
                    ROUTE_L2.ORG_TEMPLATE_VIEW + "?id=" + reqPayload?.id,
                    {
                      state: resp?.body?.[0],
                    }
                  );
                }
              })
              .catch((e) => navigate(ROUTE_L2.OMS_ORGANOGRAM_DRAFT_LIST));
          }
        } else {
          navigate(ROUTE_L2.ORG_TEMPLATE_LIST);
        }
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  return (
    <>
      {isLoading && <ContentPreloader />}
      {!isLoading &&
        !isObjectNull(data) &&
        (organizationId ? (
          <TemplateEditComponent
            onSubmit={onSubmit}
            isSubmitLoading={isSubmitLoading}
            updateData={data}
          />
        ) : (
          <TemplateComponent
            onSubmit={onSubmit}
            isSubmitLoading={isSubmitLoading}
            updateData={data}
          />
        ))}
      {!isLoading && isObjectNull(data) && (
        <NoData details="কোনো টেমপ্লেট তথ্য খুঁজে পাওয়া যায় নি !!" />
      )}
    </>
  );
};

export default TemplateUpdate;
