import { Autocomplete, IconButton } from "@gems/components";
import { IObject } from "@gems/utils";
// import { ReportService } from "@services/api/Report.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Filter = ({ onFilter }) => {
  const [options, setOptions] = useState<IObject>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Promise.all([ReportService.getBatchList({ isUno: false })]).then((resp) => {
    // 	setOptions({
    // 		batchList: resp[0]?.body,
    // 	});
    // });
  }, []);

  const onSubmit = (data) => {
    data.batchKeys = data?.batchToDto?.map((b) => b?.metaKey);
    onFilter(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="row">
        {/* <div className="col-md-3 col-sm-6">
					<DateInput
						noMargin
						label="নির্ধারিত তারিখ"
						name="toDate"
						control={control}
						isRequired
						isError={!!errors?.toDate}
					/>
				</div> */}
        <div className="col-md-3 col-sm-6">
          <Autocomplete
            noMargin
            label="ব্যাচ"
            isMulti
            name="batchToDto"
            options={options?.batchList}
            getOptionLabel={(op) => op?.titleBn}
            getOptionValue={(op) => op?.metaKey}
            control={control}
            isRequired
            isError={!!errors?.batchToDto}
          />
        </div>
        <div className="col d-flex justify-content-start align-items-end mt-3">
          <IconButton
            iconName="search"
            type="submit"
            variant="fill"
            color="primary"
            rounded={false}
          />
        </div>
      </div>
    </form>
  );
};

export default Filter;
