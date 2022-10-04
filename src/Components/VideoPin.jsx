import {
  Flex,
  Image,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../Utils/FetchData";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
const VideoPin = ({ data }) => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("blackAlpha.700", "gray.900");
  const textColor = useColorModeValue("gray.100", "gray.100");

  const firestoreDb = getFirestore(firebaseApp);

  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (data) setUserId(data.userId);
    if (userId)
      getUserInfo(firestoreDb, userId).then((data) => {
        setUserInfo(data);
      });
  }, [userId]);

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems="center"
      direction={"column"}
      cursor="pointer"
      shadow={"lg"}
      _hover={{ shadow: "xl" }}
      rounded="md"
      overflow={"hidden"}
      position="relative"
      maxWidth={"300px"}
    >
      <Link to={""}>
        <video
          src={data.videoUrl}
          muted
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => e.target.pause()}
        />
      </Link>
      <Flex
        position={"absolute"}
        bottom="0"
        left={"0"}
        p="2"
        bg={bg}
        width="full"
        direction={"column"}
      >
        <Flex
          width={"full"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Text color={textColor} isTruncated fontSize={20}>
            {data.title}
          </Text>

          <Image src={userInfo?.photoURL} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default VideoPin;
