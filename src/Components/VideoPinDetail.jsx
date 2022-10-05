import {
  Box,
  Flex,
  Grid,
  GridItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoHome, IoPause, IoPlay } from "react-icons/io5";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import { firebaseApp } from "../firebase-config";
import { getSpecificVideo } from "../Utils/FetchData";
import Spinner from "./Spinner";

import {
  MdForward10,
  MdFullscreen,
  MdOutlineReplay10,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";

const VideoPinDetail = () => {
  const textColor = useColorModeValue("gray.900", "gray.50");
  const { videoId } = useParams();
  const firestoreDb = getFirestore(firebaseApp);
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);

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
      {/* Main grid for Video */}
      <Grid templateColumns="repeat(3, 1fr)" gap={2} width="100%">
        <GridItem width={"100%"} colSpan="2">
          <Flex width={"full"} bg="black" position={"relative"}>
            <ReactPlayer
              url={videoInfo?.videoUrl}
              width="100%"
              height={"100%"}
              playing={isPlaying}
              muted={muted}
            />
            {/* Controls for Video Player */}
            <Flex
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              direction="column"
              justifyContent={"space-between"}
              alignItems="center"
              zIndex={1}
              cursor="pointer"
            >
              {/* Play Icon */}
              <Flex
                alignItems="center"
                justifyContent="center"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
                width="full"
                height={"full"}
              >
                {!isPlaying && (
                  <IoPlay fontSize={60} color="#f2f2f2" cursor={"pointer"} />
                )}
              </Flex>

              {/* Progress Controls */}

              <Flex
                width={"full"}
                alignItems="center"
                direction={"column"}
                px="4"
                bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
              >
                <Slider
                  aria-label="slider-ex-4"
                  defaultValue={30}
                  min={0}
                  max={100}
                >
                  <SliderTrack bg={"teal.50"}>
                    <SliderFilledTrack bg={"teal.300"} />
                  </SliderTrack>
                  <SliderThumb boxSize={3} bg={"teal.300"} />
                </Slider>

                {/* Other Player Controls */}
                <Flex width={"full"} alignItems="center" my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor="pointer"
                  />

                  <Box
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                    }}
                  >
                    {!isPlaying ? (
                      <IoPlay
                        fontSize={30}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    ) : (
                      <IoPause
                        fontSize={30}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    )}
                  </Box>

                  <MdForward10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor="pointer"
                  />

                  {/*  Volume Controls*/}
                  <Flex alignItems={"center"}>
                    <Box
                      onClick={() => {
                        setMuted(!muted);
                      }}
                    >
                      {!muted ? (
                        <MdVolumeUp
                          fontSize={30}
                          color="#f1f1f1"
                          cursor={"pointer"}
                        />
                      ) : (
                        <MdVolumeOff
                          fontSize={30}
                          color="#f1f1f1"
                          cursor={"pointer"}
                        />
                      )}
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem width={"100%"} colSpan="1"></GridItem>
      </Grid>
    </Flex>
  );
};

export default VideoPinDetail;
