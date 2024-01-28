import { saveCaption, saveDate, saveStatus } from "@api/db";
import { Action } from "@constants/types";
import useCampaign from "@context/campaignContext";
import useRequest from "@hooks/useRequest";
import { Button, Flex, LoadingOverlay, Text, Modal } from "@mantine/core";
import DatePicker from "@molecules/DatePicker";
import EditableInput from "@molecules/EditableInput";
import { useState } from "react";
import ActionModal from "./ActionModal";
import { publishPost } from "@api/content";
import { useDisclosure } from "@mantine/hooks";

interface CardProps {
  id: string;
  label: string;
  date: Date;
  desc?: string;
  image?: string;
  caption?: string;
  status?: string;
  actions: Action[];
  mutate: (v: any) => void;
}

const ActionCard = ({
  id,
  label,
  date,
  image,
  caption,
  status,
  actions,
  mutate,
}: CardProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { campaign } = useCampaign();
  const [openCard, setOpenCard] = useState<string | null>(null);

  const { makeRequest: requestSaveDate } = useRequest({
    request: saveDate,
    requestByDefault: false,
  });

  const { makeRequest: requestSaveCaption } = useRequest({
    request: saveCaption,
    requestByDefault: false,
  });

  const { makeRequest: requestSaveStatus } = useRequest({
    request: saveStatus,
    requestByDefault: false,
  });

  const {
    data: requestPublishRes,
    loading,
    makeRequest: requestPublishPost,
  } = useRequest({
    request: publishPost,
    requestByDefault: false,
  });

  const handleSaveDate = async (v: Date) => {
    await requestSaveDate({
      post_id: id,
      date: v,
    });
    mutate(`campaign_id=${campaign}`);
  };

  const handleSaveCaption = async (v: string) => {
    await requestSaveCaption({
      post_id: id,
      caption: v,
    });
    mutate(`campaign_id=${campaign}`);
  };

  const handleSaveStatus = async (v: string) => {
    await requestSaveStatus({
      post_id: id,
      status: v,
    });
    mutate(`campaign_id=${campaign}`);
  };

  const handleAction = async (type: string) => {
    if (image && caption) {
      await requestPublishPost({
        media_url: image,
        media_type: type === "Static Post" ? "IMAGE" : "STORIES",
        caption: caption,
      });
      await handleSaveStatus("posted");
    }
  };

  return (
    <Flex
      sx={{ flexDirection: "column", opacity: status == "posted" ? 0.5 : 1 }}
    >
      <DatePicker date={date} handleSave={handleSaveDate} />
      <Flex
        sx={{
          flexDirection: "column",
          borderRadius: "5px",
          backgroundColor: "white",
          width: "400px",
        }}
      >
        <Flex
          sx={{
            width: "100%",
            backgroundColor: "black",
            padding: "8px 16px",
            borderRadius: "5px 5px 0 0",
          }}
        >
          <Text size="sm" color="white">
            {label}
          </Text>
        </Flex>
        <Flex sx={{ flexDirection: "column", padding: "16px", gap: "12px" }}>
          <Flex sx={{ maxWidth: "100%" }}>
            <img style={{ width: "100%" }} src={image} />
          </Flex>
          {caption && (
            <EditableInput text={caption} handleSave={handleSaveCaption} />
          )}
          <Flex sx={{ width: "100%", justifyContent: "flex-end", gap: "8px" }}>
            {actions.map((a) => (
              <Button
                key={a.name}
                onClick={() => setOpenCard(a.name)}
                variant={a.variant}
                color="dark"
                sx={{ fontSize: "12px" }}
                disabled={status == "posted"}
              >
                {a.label}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Flex>
      {openCard && (
        <ActionModal
          openCard={!!openCard}
          type={requestPublishRes ? "success" : openCard}
          handleClose={() => setOpenCard(null)}
          handleAction={handleAction}
        />
      )}
      {loading && (
        <LoadingOverlay visible={loading} zIndex={1000} overlayBlur={2} />
      )}
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </Flex>
  );
};

export default ActionCard;
