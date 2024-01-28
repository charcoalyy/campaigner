import { useAuth0 } from "@auth0/auth0-react";
import { Flex, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface TitleProps {
  img: string;
  mainTitle: string;
  subTitle: string;
}

const Title = ({ img, mainTitle, subTitle }: TitleProps) => {
  const firstHalfMain = mainTitle.split("deeper")[0];
  const secondHalfMain = mainTitle.split("deeper")[1];
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/profile");
  };

  const { loginWithRedirect } = useAuth0();

  // TODO: Fix the italics on deeper
  return (
    <Flex
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F7F5F0",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "24px",
        padding: "32px",
      }}
    >
      <Flex sx={{ maxWidth: "180px", justifyContent: "center" }}>
        <img style={{ width: "100%" }} src={img} />
      </Flex>

      <Flex sx={{ flexDirection: "column", width: "550px", gap: "24px" }}>
        <Text
          size="84px"
          sx={{
            fontFamily: "Source Serif Pro",
            lineHeight: "64px",
            textAlign: "center",
          }}
        >
          {firstHalfMain}
          <span style={{ fontStyle: "italic", fontWeight: 300 }}>deeper</span>
          {secondHalfMain}
        </Text>

        <Text
          size="16px"
          fs="italic"
          sx={{
            fontFamily: "Source Serif Pro",
            textAlign: "center",
            lineHeight: "20px",
          }}
        >
          {subTitle}
        </Text>
      </Flex>

      <Flex sx={{ flexDirection: "row", gap: "8px" }}>
        <Button
          variant="filled"
          color="dark"
          size="lg"
          radius="xs"
          sx={{ fontSize: "14px" }}
          // onClick={() => loginWithRedirect({ screen_hint: "signup" })}
        >
          GET STARTED
        </Button>
        <Button
          variant="outline"
          color="dark"
          size="lg"
          radius="xs"
          sx={{ fontSize: "14px" }}
          onClick={() => loginWithRedirect()}
        >
          LOG BACK IN
        </Button>
      </Flex>
    </Flex>
  );
};

export default Title;
