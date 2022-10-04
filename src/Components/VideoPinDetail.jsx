import {
  Box,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { firebaseApp } from "../firebase-config";
import { getSpecificVideo } from "../Utils/FetchData";
import Spinner from "./Spinner";

const VideoPinDetail = () => {
  const textColor = useColorModeValue("gray.900", "gray.50");
  const { videoId } = useParams();
  const firestoreDb = getFirestore(firebaseApp);
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState("");

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);
        setIsLoading(false);
      });
    }
  }, [videoId]);

  if (isLoading) return <Spinner />;

  return (
    <Flex
      width={"full"}
      height="auto"
      justifyContent={"center"}
      alignItems="center"
      direction={"column"}
      py={2}
      px={4}
    >
      <Flex alignItems={"center"} width="full" my={4}>
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <Box width={"1px"} height="25px" bg={"gray.500"} mx={2}></Box>
        <Text color={textColor} fontWeight="semibold" width={"100%"}>
          {videoInfo.title}
        </Text>
      </Flex>
    </Flex>
  );
};

export default VideoPinDetail;

// 1h19m
