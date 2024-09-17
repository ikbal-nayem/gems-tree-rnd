import {
  Button,
  ContentPreloader,
  Icon,
  NoData,
  toast,
} from "@gems/components";
import { IObject, isListNull, isObjectNull } from "@gems/utils";
import { GemsLogoBase64 } from "@modules/organogram-templates/components/template-view-component/utils";
import { ProposalService } from "@services/api/Proposal.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import Form from "./Form";

interface ICheckListView {
  organogramId: string;
}

const checkListView = ({ organogramId }: ICheckListView) => {
  const [changeTypeList, setChangeTypeList] = useState<IObject[]>([]);
  const [selectedChangeType, setSelectedChangeType] = useState<IObject>({});
  const [checkListData, setCheckListData] = useState<IObject[]>([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isChecklistLoading, setIsChecklistLoading] = useState<boolean>(false);
  const [isPDFLoading, setPDFLoading] = useState<boolean>(false);

  useEffect(() => {
    getChangeTypeList();
  }, [organogramId]);

  const getChangeTypeList = () => {
    ProposalService.FETCH.changeTypesByOrganogramId(organogramId)
      .then((resp) => {
        setChangeTypeList(resp?.body || []);
      })
      .catch((e) => toast.error(e?.message));
  };

  const onChangeTypeChange = (item: IObject) => {
    setSelectedChangeType(item);
    if (item?.id) {
      setIsChecklistLoading(true);
      ProposalService.FETCH.checklistByChangeTypeId(item?.id, organogramId)
        .then((resp) => {
          setCheckListData(resp?.body || []);
        })
        .catch((e) => toast.error(e?.message))
        .finally(() => setIsChecklistLoading(false));
    }
  };

  const onSubmit = (data) => {
    setIsSubmitLoading(true);
    let fileList =
      (data?.orgmChangeList?.length > 0 &&
        data?.orgmChangeList.flatMap(
          (item) =>
            item.orgChecklistDtoList?.length > 0 &&
            item.orgChecklistDtoList
              .filter(
                (subItem) =>
                  subItem?.attachmentFile !== undefined && subItem?.fileName
              )
              ?.map((d) => {
                return d?.attachmentFile;
              })
        )) ||
      [];

    data?.orgmChangeList?.length > 0 &&
      data?.orgmChangeList.forEach(
        (item) =>
          item.orgChecklistDtoList?.length > 0 &&
          item.orgChecklistDtoList?.forEach((d) => {
            if (d?.fileName) {
              delete d.attachmentFile;
            }
          })
      );

    let fd = new FormData();
    fd.append("orgmId", organogramId || "");
    fd.append("changeTypeId", selectedChangeType?.id || "");
    fd.append("body", JSON.stringify(data?.orgmChangeList));
    fileList?.length > 0 &&
      fileList.forEach((element) => {
        fd.append("files", element);
      });

    ProposalService.SAVE.proposalChecklist(fd)
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  const captureAndConvertToPDF = async (fileName) => {
    setPDFLoading(true);
    const pdf: any = new jsPDF("p", "px", "a4");

    const canvas = await html2canvas(document.getElementById("pdfDownload"), {
      scale: 3,
      onclone: (clone: any) => {
        clone.querySelector(".pdfPadding").style.padding = "20px";
        clone.querySelector(".pdfHeader").style.overflow = "auto";
        clone.querySelector(".pdfHeader").style.height = "fit-content";
      },
    });

    const imageData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight() - 15;
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imageWidth, pdfHeight / imageHeight);

    pdf.addImage(
      imageData,
      "PNG",
      0,
      8,
      imageWidth * ratio,
      imageHeight * ratio,
      "",
      "FAST"
    );

    const pageCount = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      if (GemsLogoBase64) {
        pdf.addImage(
          GemsLogoBase64,
          "png",
          pdf.internal.pageSize.getWidth() / 2 - 40,
          pdf.internal.pageSize.getHeight() - 11,
          10,
          10
        );
      }
      pdf.setFontSize(8);
      pdf.text(
        `Digitally generated by GEMS`,
        pdf.internal.pageSize.getWidth() / 2 - 30,
        pdf.internal.pageSize.getHeight() - 4
      );
    }

    // pdf.autoPrint();
    // window.open(pdf.output("bloburl"), "_blank");

    pdf.save(fileName ? fileName + ".pdf" : "Checklist.pdf");

    setPDFLoading(false);
  };

  return (
    <div>
      {changeTypeList?.length > 0 ? (
        <>
          <div className="d-flex bg-white rounded mb-3 overflow-auto justify-content-between">
            <div className="d-flex">
              {changeTypeList?.map((item, idx) => {
                return (
                  <Button
                    onClick={() => onChangeTypeChange(item)}
                    key={idx}
                    variant="fill"
                  >
                    <span
                      className={`fs-5 ${
                        selectedChangeType?.id === item?.id
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      {item?.titleBn}
                    </span>
                  </Button>
                );
              })}
            </div>
            {!isObjectNull(selectedChangeType) && (
              <Button
                color="primary"
                className="rounded-circle px-3 py-3"
                isDisabled={isPDFLoading}
                size="sm"
                onClick={() =>
                  captureAndConvertToPDF(
                    `${selectedChangeType?.titleBn} এর চেকলিস্ট`
                  )
                }
                variant="active-light"
                hoverTitle="চেকলিস্ট ডাউনলোড করুন"
              >
                {isPDFLoading ? (
                  <span
                    className={`spinner-border spinner-border-md align-middle`}
                  ></span>
                ) : (
                  <Icon
                    icon="file_download"
                    className=""
                    size={20}
                    color="primary"
                  />
                )}
              </Button>
            )}
            {/* <IconButton
              iconName="file_download"
              iconVariant="outlined"
              color="primary"
              hoverTitle={"চেক লিস্ট ডাউনলোড করুন"}
              onClick={captureAndConvertToPDF}
              
            /> */}
          </div>
          {isChecklistLoading && <ContentPreloader />}
          {!isObjectNull(selectedChangeType) &&
            !isChecklistLoading &&
            !isListNull(checkListData) && (
              <Form
                data={checkListData || []}
                onSubmit={onSubmit}
                isSubmitLoading={isSubmitLoading}
                selectedChangeType={selectedChangeType}
                pdfDownloadId={"pdfDownload"}
              />
            )}
        </>
      ) : (
        <NoData details="কোনো চেকলিস্ট তথ্য নেই" />
      )}
    </div>
  );
};

export default checkListView;
