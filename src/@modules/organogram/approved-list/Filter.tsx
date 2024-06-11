import Drawer from "@components/Drawer";
import {
  Autocomplete,
  DateInput,
  DrawerBody,
  DrawerHeader,
  FilterFooter,
  IconButton,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
// import { ReportService } from "@services/api/Report.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeReqBody } from "../_helper";

const filterKeyMapping = {
  approverId: "id",
  organizationGroupId: "id",
};

const Filter = ({ onFilter }) => {
  const [useList, setUserList] = useState<IObject[]>([]);
  const [organizationGroupList, setOrganizationGroupList] = useState<IObject[]>(
    []
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getOrgGroupList();
  }, []);

  const getOrgGroupList = () => {
    OMSService.FETCH.organizationGroupList().then((resp) =>
      setOrganizationGroupList(resp?.body)
    );
  };

  useEffect(() => {
    OMSService.FETCH.approveUserList()
      .then((res) => {
        setUserList(res?.body || []);
      })
      .catch((e) => console.log(e?.message));
  }, []);

  const onClose = () => setOpen(false);

  const onSubmit = (data) => {
    onFilter(makeReqBody(data, filterKeyMapping));
    reset();
    onClose();
  };

  return (
    <>
      <IconButton
        iconName="filter_alt"
        rounded={false}
        iconSize={15}
        color="primary"
        onClick={() => setOpen(true)}
      />
      <Drawer isOpen={open} closeOnBackdropClick handleClose={onClose}>
        <DrawerHeader title="ফিল্টার" closeIconAction={onClose} />
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DrawerBody>
            <Autocomplete
              label="অনুমোদন ব্যবহারকারী"
              placeholder="অনুমোদন ব্যবহারকারী"
              // isMulti
              options={useList || []}
              getOptionLabel={(op) => op.nameBn}
              getOptionValue={(op) => op?.id}
              name="approverId"
              control={control}
            />
            <DateInput
              label="অনুমোদনের তারিখ"
              placeholder="অনুমোদনের তারিখ"
              control={control}
              name="approverDate"
            />
            <DateInput
              label="অর্গানোগ্রাম তারিখ"
              placeholder="অর্গানোগ্রাম তারিখ"
              control={control}
              name="organogramDate"
            />
            <Autocomplete
              label="প্রতিষ্ঠানের গ্ৰুপ"
              placeholder="প্রতিষ্ঠানের গ্ৰুপ বাছাই করুন"
              name="organizationGroupId"
              options={organizationGroupList}
              noMargin
              control={control}
              // autoFocus
              getOptionLabel={(op) => op?.nameBn}
              getOptionValue={(op) => op?.id}
            />
          </DrawerBody>
          <FilterFooter onClose={onClose} />
        </form>
      </Drawer>
    </>
  );
};

export default Filter;
