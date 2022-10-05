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
  Image,
  useColorMode,
  useColorModeValue,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { IoHome, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { FcApproval } from "react-icons/fc";
import ReactPlayer from "react-player";
import { Link, useNavigate, useParams } from "react-router-dom";
import { firebaseApp } from "../firebase-config";
import { deleteVideo, getSpecificVideo, getUserInfo } from "../Utils/FetchData";
import Spinner from "./Spinner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";

import {
  MdForward10,
  MdFullscreen,
  MdOutlineReplay10,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import logo from "../assets/logo.png";
import screenfull from "screenfull";
import moment from "moment";
import { fetchUser } from "../utils/fetchUser";

// Duration format
const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")} : ${ss}`;
    // 01:02:32
  }

  return `${mm}:${ss}`;
  // 02:33
};

const avatar =
  "https://ak.picdn.net/contributors/3038285/avatars/thumb.jpg?t=164360626";

const VideoPinDetail = () => {
  // firestore database instance

  const [localUser] = fetchUser();
  const navigate = useNavigate();
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

  // Custom REF

  const playerRef = useRef();
  const playerContainer = useRef();

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);
        getUserInfo(firestoreDb, data.userId).then((user) => {
          setUserInfo(user);
        });
        setIsLoading(false);
      });
    }
  }, [videoId]);

  useEffect(() => {}, [muted, volume, played]);

  const onvolumechange = (e) => {
    setVolume(parseFloat(e / 100));

    e === 0 ? setMuted(true) : setMuted(false);
  };

  const handleFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 100));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const onSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(e / 100);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);

  const deleteTheVideo = (videoId) => {
    setIsLoading(true);
    deleteVideo(firestoreDb, videoId);
    setIsLoading(false);

    navigate("/", { replace: "true" });
  };

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
          <Flex
            width={"full"}
            bg="black"
            position={"relative"}
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoUrl}
              width="100%"
              height={"100%"}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
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
                  min={0}
                  max={100}
                  value={played * 100}
                  transition="ease-in-out"
                  transitionDelay={"0.2"}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg={"teal.50"}>
                    <SliderFilledTrack bg={"teal.300"} />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={3}
                    bg={"teal.300"}
                    transition="ease-in-out"
                    transitionDelay={"0.2"}
                  />
                </Slider>

                {/* Other Player Controls */}
                <Flex width={"full"} alignItems="center" my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor="pointer"
                    onClick={handleFastRewind}
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
                    onClick={handleFastForward}
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

                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={volume * 100}
                      min={0}
                      max={100}
                      size="sm"
                      width={16}
                      mx={2}
                      onChangeStart={onvolumechange}
                      onChangeEnd={onvolumechange}
                    >
                      <SliderTrack bg={"teal.50"}>
                        <SliderFilledTrack bg={"teal.300"} />
                      </SliderTrack>
                      <SliderThumb boxSize={2} bg={"teal.300"} />
                    </Slider>
                  </Flex>

                  {/* Duration */}
                  <Flex alignItems={"center"} gap={2}>
                    <Text fontSize={16} color="whitesmoke">
                      {elapsedTime}
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      /
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      {totalDuration}
                    </Text>
                  </Flex>
                  <Image src={logo} width={"120px"} ml="auto" />

                  <MdFullscreen
                    fontSize={30}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={() => {
                      screenfull.toggle(playerContainer.current);
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* Video Description */}

          {videoInfo?.description && (
            <Flex my={6} direction="column">
              <Text my={2} fontSize={25} fontWeight="semibold">
                Description
              </Text>
              {videoInfo.description}
            </Flex>
          )}
        </GridItem>
        <GridItem width={"100%"} colSpan="1">
          {userInfo && (
            <Flex direction={"column"} width="full">
              <Flex alignItems={"center"} width="full">
                <Image
                  src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
                  rounded="full"
                  width={"60px"}
                  height={"60px"}
                  minHeight="60px"
                  minWidth={"60px"}
                />

                <Flex direction={"column"} ml={3}>
                  <Flex alignItems={"center"}>
                    <Text color={textColor} fontWeight="semibold">
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={12}>
                      {moment(
                        new Date(parseInt(videoInfo.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>

              {/* Action Buttons */}
              <Flex justifyContent={"space-around"} mt={6}>
                {userInfo?.uid === localUser.uid && (
                  <Popover closeOnEsc>
                    <PopoverTrigger>
                      <Button colorScheme={"red"}>
                        <IoTrash fontSize={20} color="#fff" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmation!</PopoverHeader>
                      <PopoverBody>
                        Are you sure you want to delete current video?
                      </PopoverBody>
                      <PopoverFooter display="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="red"
                            onClick={() => deleteTheVideo(videoId)}
                          >
                            Yes
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default VideoPinDetail;
