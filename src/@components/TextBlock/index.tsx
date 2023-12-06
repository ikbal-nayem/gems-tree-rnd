import { Fragment } from "react";
import { breakNewLines, numOfTabs } from "utility/utils";

type ITextBlockProps = {
  value: any | string;
  subPointGap?: number;
  subSubPointGap?: number;
};

const TextBlock = ({
  value,
  subPointGap = 4,
  subSubPointGap = 10,
}: ITextBlockProps) => {
  return breakNewLines(value)?.map((line, idx) => {
    return (
      <Fragment key={idx}>
        <span
          className={
            idx > 0
              ? numOfTabs(line) > 0
                ? `ps-${subSubPointGap}`
                : `ps-${subPointGap}`
              : ""
          }
        >
          {line}
        </span>
        <br />
      </Fragment>
    );
  });
};

export default TextBlock;
