export const MSG = {
  EN: {
    SEND_TO_REVIEW: "Do you want to Send this to Reviewer",
    SEND_TO_APPROVE: "Do you want to Send this to Approver",
    SEND_BACK_TO_NEW: "Do you want to Send this back",
    SEND_BACK_TO_REVIEW: "Do you want to Send this back to Reviewer",
    APPROVE: "Do you want to Approve it",
  },
  BN: {
    SEND_TO_REVIEW: "আপনি কি এটি রিভিউয়ারকে পাঠাতে চান?",
    SEND_TO_APPROVE: "আপনি কি এটি অনুমোদনকারীর কাছে পাঠাতে চান?",
    SEND_BACK_TO_NEW: "আপনি কি এটি ফেরত পাঠাতে চান?",
    SEND_BACK_TO_REVIEW: "আপনি কি এটি রিভিউয়ারকে ফেরত পাঠাতে চান?",
    APPROVE: "আপনি কি এটি অনুমোদন করতে চান?",
  },
};

export const BUTTON_LABEL = {
  EN: {
    SEND: "Send",
    SEND_BACK: "Send Back",
    APPROVE: "Approve",
  },
  BN: {
    SEND: "পাঠান",
    SEND_BACK: "ফেরত পাঠান",
    APPROVE: "অনুমোদন",
  },
};






// const data = document.getElementById('pdfPage_');
// html2canvas(data).then((canvas:any) => {
//   const imgWidth = 208;
//   const pageHeight = 295;
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;
//   let heightLeft = imgHeight;
//   let position = 0;
//   heightLeft -= pageHeight;
//   const doc = new jspdf('p', 'mm');
//   doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
//   while (heightLeft >= 0) {
//     position = heightLeft - imgHeight;
//     doc.addPage();
//     doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
//     heightLeft -= pageHeight;
//   }
//   doc.save('Downld.pdf');
// });
