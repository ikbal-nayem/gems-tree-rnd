import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const captureAndConvertToPDF = async (
  isPrint = false,
  setPDFLoading
) => {
  setPDFLoading(true);
  // Get references to the HTML elements you want to capture
  const elementsToCapture = document.getElementsByClassName("pdfGenarator");
  // Create a new instance of jsPDF
  const pdf = new jsPDF("l", "px", "letter");

  // Loop through the elements and capture each one
  for (let i = 0; i < elementsToCapture.length; i++) {
    const element: any = elementsToCapture[i];

    // Use html2canvas to capture the element
    const canvas = await html2canvas(element, {
      scale: 2.5,
      onclone: (clone: any) => {
        clone.querySelector(".animate__fadeIn") &&
          (clone.querySelector(".animate__fadeIn").style.animation = "none");
        clone.querySelector(".allocationBlock").style.overflow = "auto";
        clone.querySelector(".allocationBlock").style.height = "fit-content";
        clone.querySelector(".allocationBlock").style.paddingTop = "20px";
        clone.querySelector(".allocationBlock").style.paddingLeft = "200px";
        clone.querySelector(".allocationBlock").style.paddingRight = "200px";
        clone.querySelector(".allocationBlock").style.paddingBottom = "30px";
        clone.querySelector(".treeTitle").style.overflow = "visible";
        clone.querySelector(".treeTitle").style.height = "fit-content";
        clone.querySelector(".dataBlock").style.overflow = "auto";
        clone.querySelector(".dataBlock").style.height = "fit-content";
        clone.querySelector(".dataBlock").style.padding = "20px";
        clone.querySelector(".dataBlock").style.paddingBottom = "30px";
        clone.querySelector(".orgchart").style.paddingBottom = "15px";
        clone.querySelector(".orgchart").style.minWidth = "2140px";
      },
    });

    if (i > 0) pdf.addPage();
    // Convert the canvas to an image and add it to the PDF
    const imageData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

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
  }

  // For open direct print
  if (isPrint) {
    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
  }

  // Save or display the PDF
  else pdf.save("Organogram With Data.pdf");
  setPDFLoading(false);
};
