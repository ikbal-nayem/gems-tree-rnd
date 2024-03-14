import { COMMON_LABELS } from "@gems/utils";
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

export const STATE = {
  ENTRY: "NEW",
  REVIEW: "IN_REVIEW",
  APPROVAL: "IN_APPROVE",
};

export const ACTIONS = {
  SEND_TO_REVIEW: "SEND_TO_REVIEW",
  BACK_TO_NEW: "BACK_TO_NEW",
  SEND_TO_APPROVE: "SEND_TO_APPROVE",
  BACK_TO_REVIEW: "BACK_TO_REVIEW",
  APPROVE: "APPROVE",
};

export const LABEL = {
  ...COMMON_LABELS,
  NAME_OF_POSTS: "পদবি",
  NO_OF_POSTS: "লোকবল",
  TOTAL: "মোট",
  GRAND_TOTAL: "সর্বমোট",
  NAME: "নাম",
  GO_NUMBER: "জিও নম্বর",
  GO_DATE: "জিও তারিখ",
  CURRENT_MANPOWER: "বর্তমান জনবল",
  PROPOSED_MANPOWER: "প্রস্তাবিত জনবল",
  SUM_OF_MANPOWER: "জনবল",
  CURRENT_INVENTORY: "বর্তমান যানবাহন, অফিস সরঞ্জাম ও বিবিধ",
  PROPOSED_INVENTORY: "প্রস্তাবিত যানবাহন, অফিস সরঞ্জাম ও বিবিধ",
  CURRENT_ABBREVIATION: "বর্তমান শব্দসংক্ষেপ",
  PROPOSED_ABBREVIATION: "প্রস্তাবিত শব্দসংক্ষেপ",

  EN: {
    NAME_OF_POSTS: "Name of Posts",
    NO_OF_POSTS: "No of Posts",
    TOTAL: "Total",
    GRAND_TOTAL: "GRAND TOTAL",
    NAME: "Name",
    SL_NO: "Sl No",
    GO_NUMBER: "GO No",
    GO_DATE: "GO Date",
    SUM_OF_MANPOWER: "Summary of Manpower",
    ATTACHMENT: "ATTACHMENT",
  },
};
