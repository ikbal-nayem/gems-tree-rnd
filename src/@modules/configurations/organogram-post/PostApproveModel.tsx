import {
  Button,
  Checkbox,
  ContentPreloader,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Textarea,
  toast,
} from "@gems/components";
import { IObject } from "@gems/utils";
import { OMSService } from "@services/api/OMS.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ICard {
  isOpen: boolean;
  onClose: () => void;
  selectedPost: any;
  getDataList: () => void;
}

const PostApproveModel = ({
  isOpen,
  onClose,
  selectedPost,
  getDataList,
}: ICard) => {
  const [postData, setPostData] = useState<IObject>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [isRank, setIsRank] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen && selectedPost) {
      setIsLoading(true);
      setIsRank(false);
      OMSService.FETCH.organogramApprovedPostList(selectedPost.id)
        .then((res) => {
          setPostData(res.body || {});
        })
        .catch((err) => toast.error(err?.message))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, selectedPost]);

  const handleApprove = () => {
    setIsSubmitLoading(true);
    const payload = {
      postNameEn: postData?.newPostNameEn,
      postNameBn: postData?.newPostNameBn,
      id: selectedPost?.id || "",
      isRank: isRank,
    };
    OMSService.SAVE.organogramApprovePost(payload)
      .then((res) => {
        toast.success(res?.message);
        setPostData({});
        getDataList();
        onClose();
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => {
        setIsSubmitLoading(false);
      });
  };

  const handleReject = () => {
    setRejectModalOpen(true);
    onClose();
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
  };

  const onSubmit = (data) => {
    setIsSubmitLoading(true);
    const payload = {
      id: selectedPost?.id || "",
      remarks: data?.remarks,
    };
    OMSService.UPDATE.organogramPostReject(payload)
      .then((res) => {
        toast.success(res?.message);
        setRejectModalOpen(false);
        getDataList();
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsSubmitLoading(false));
  };

  const mergedExistingPosts = [
    ...(postData?.existingPostNameBn || []),
    ...(postData?.existingPostNameEn || []),
  ];

  return (
    <>
      <Modal
        title={"অনুমোদন"}
        isOpen={isOpen}
        handleClose={onClose}
        holdOn
        size="lg"
      >
        <ModalBody>
          {isLoading ? (
            <ContentPreloader />
          ) : (
            <div className="p-2">
              <Checkbox
                label="প্রস্তাবিত পদবিটির পদনাম একই"
                onChange={(e) => setIsRank(e?.target?.checked)}
              />
              <div className="row">
                <div className="col-12 text-center">
                  <Table>
                    <TableHead>
                      <TableCell text={"নতুন পদবি"} textAlign="center" />
                      <TableCell text={"বিদ্যমান পদবি"} textAlign="center" />
                    </TableHead>
                    <TableRow>
                      <TableCell
                        text={`${postData?.newPostNameBn || ""} | ${
                          postData?.newPostNameEn || ""
                        }`}
                      />
                      <TableCell>
                        {mergedExistingPosts.length > 0 ? (
                          <div>
                            {mergedExistingPosts.map((data, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  text={`${data.nameBn || ""} | ${
                                    data.nameEn || ""
                                  }`}
                                />
                              </TableRow>
                            ))}
                          </div>
                        ) : (
                          <p>এই পদবির সাথে কোনো বিদ্যমান পদবি নেই</p>
                        )}
                      </TableCell>
                    </TableRow>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        {!isLoading && (
          <div className="d-flex justify-content-end">
            <p className="fw-bold fs-4 me-3 text-primary text-wrap">
              আপনি কি এই পদবি তৈরি করতে চান?
            </p>
          </div>
        )}

        <ModalFooter>
          <div className="d-flex justify-content-between w-100">
            <div>
              <Button color="secondary" onClick={onClose}>
                {"বন্ধ করুন"}
              </Button>
            </div>
            <div className="d-flex gap-2">
              <Button color="danger" onClick={handleReject}>
                {"বাতিল করুন"}
              </Button>
              <Button
                color="primary"
                onClick={handleApprove}
                isLoading={isSubmitLoading}
              >
                {"নিশ্চিত করুন"}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      <Modal
        title={"বাতিল করুন"}
        isOpen={isRejectModalOpen}
        handleClose={handleCloseRejectModal}
        holdOn
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <p>আপনি কি এই পদবি বাতিল করতে চান?</p>
            <Textarea
              label="মন্তব্য"
              isRequired
              placeholder="মন্তব্য লিখুন"
              maxLength={500}
              registerProperty={register("remarks", {
                required: "মন্তব্যটি আবশ্যক",
              })}
              isError={!!errors?.remarks}
              errorMessage={errors?.remarks?.message as string}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" type="submit">
              {"বাতিল করুন"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default PostApproveModel;
