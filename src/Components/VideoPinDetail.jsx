import { Flex } from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { firebaseApp } from "../firebase-config";
import { getSpecificVideo } from "../Utils/FetchData";
import Spinner from "./Spinner";

const VideoPinDetail = () => {
  const { videoId } = useParams();
  const firestoreDb = getFirestore(firebaseApp);
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);
        setIsLoading(false);
        console.log(data);
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
      </Flex>
    </Flex>
  );
};

export default VideoPinDetail;
