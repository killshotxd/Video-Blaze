import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  IoCheckmark,
  IoChevronDown,
  IoCloudUpload,
  IoLocation,
  IoTrash,
  IoWarning,
} from "react-icons/io5";
import { categories } from "../Data";
import Category from "./Category";
import Spinner from "./Spinner";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseApp } from "../firebase-config";

import { doc, getFirestore, setDoc, snapshotEqual } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AlertMsg from "./AlertMsg";

const Create = () => {
  // DEfaults---------------------

  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.50");

  // ------------States----------------------------

  const [title, setTitle] = useState("");
  const [Category, setCategory] = useState("Choose a Category");
  const [location, setLocation] = useState("");

  const [videoAsset, setVideoAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [alert, setAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertIcon, setAlertIcon] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [description, setDescription] = useState("");

  // ------------States----------------------------

  // -------------INITIALIZATION & FUNCTIONS-------
  const storage = getStorage(firebaseApp);

  const uploadImage = (e) => {
    setLoading(true);
    const videoFile = e.target.files[0];
    const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAsset(downloadURL);
          setLoading(false);
          setAlert(true);
          setAlertStatus("success");
          setAlertIcon(<IoCheckmark fontSize={20} />);
          setAlertMsg("Your video is successfully uploaded to our server.");

          setTimeout(() => {
            setAlert(false);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    const deleteRef = ref(storage, videoAsset);
    deleteObject(deleteRef)
      .then(() => {
        setVideoAsset(null);
        setAlert(true);
        setAlertStatus("error");
        setAlertIcon(<IoWarning fontSize={20} />);
        setAlertMsg("Your video is successfully removed from our server!");

        setTimeout(() => {
          setAlert(false);
        }, 4000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDescriptionValue = (e) => {
    console.log(e.target.value);
    setDescription(e.target.value);
  };

  const uploadDetails = () => {};

  useEffect(() => {}, [title, description, location, Category]);

  // -------------INITIALIZATION & FUNCTIONS-------

  // ----------MAIN APP --------------------------

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      width={"full"}
      minHeight="100vh"
      padding={10}
    >
      <Flex
        width={"80%"}
        height="100vh"
        border={"1px"}
        borderColor="gray.300"
        borderRadius={"md"}
        p="4"
        flexDirection={"column"}
        alignItems="center"
        justifyContent={"center"}
        gap={2}
      >
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon} />
        )}
        <Input
          variant={"flushed"}
          placeholder="Title"
          focusBorderColor="gray.400"
          isRequired
          errorBorderColor="red"
          type={"text"}
          _placeholder={{ color: "gray.500" }}
          fontSize={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Flex
          justifyContent={"space-between"}
          width="full"
          alignItems={"center"}
          gap={8}
          my={4}
        >
          <Menu>
            <MenuButton
              width={"full"}
              colorScheme="blue"
              as={Button}
              rightIcon={<IoChevronDown fontSize={25} />}
            >
              {Category}
            </MenuButton>
            <MenuList zIndex={101} width="md" shadow={"xl"}>
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: "blackAlpha.300" }}
                    fontSize={20}
                    px={4}
                    onClick={() => setCategory(data.name)}
                  >
                    {data.iconSrc}{" "}
                    <Text fontSize={18} ml={4}>
                      {data.name}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={
                <IoLocation
                  fontSize={20}
                  color={`${colorMode == "dark" ? "#f1f1f1" : "#111"}`}
                />
              }
            />
            <Input
              variant={"flushed"}
              placeholder="Location"
              focusBorderColor="gray.400"
              isRequired
              errorBorderColor="red"
              type={"text"}
              _placeholder={{ color: "gray.500" }}
              fontSize={20}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {/* File Selection */}
        <Flex
          border={"1px"}
          borderColor="gray.500"
          height={"400px"}
          borderStyle="dashed"
          borderRadius={"md"}
          width="full"
          overflow="hidden"
          position={"relative"}
        >
          {!videoAsset ? (
            <FormLabel width={"full"}>
              <Flex
                direction={"column"}
                alignItems="center"
                justifyContent={"center"}
                height="full"
                width={"full"}
              >
                <Flex
                  direction={"column"}
                  alignItems="center"
                  justifyContent={"center"}
                  height="full"
                  width={"full"}
                  cursor="pointer"
                >
                  {loading ? (
                    <Spinner
                      msg={"Uploading your Video..."}
                      progress={progress}
                    />
                  ) : (
                    <>
                      <IoCloudUpload
                        fontSize={30}
                        color={`${colorMode == "dark" ? "#f1f1f1" : "#111"}`}
                      />
                      <Text mt={5} fontSize={20} color={textColor}>
                        Click to upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
              {!loading && (
                <input
                  type={"file"}
                  name="upload"
                  onChange={uploadImage}
                  style={{ width: 0, height: 0 }}
                  accept="video/mp4,video/x-m4v,video/*"
                />
              )}
            </FormLabel>
          ) : (
            <Flex
              width={"full"}
              height={"full"}
              justifyContent="center"
              alignItems={"center"}
              bg="black"
              position="relative"
            >
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"40px"}
                height={"40px"}
                rounded="full"
                bg={"red"}
                top={5}
                right={5}
                position={"absolute"}
                cursor={"pointer"}
                zIndex={10}
                onClick={deleteImage}
              >
                <IoTrash fontSize={20} color="white" />
              </Flex>
              <video
                src={videoAsset}
                controls
                style={{ width: "100%", height: "100%" }}
              />
            </Flex>
          )}
        </Flex>
        <Input
          height={100}
          width="full"
          onChange={getDescriptionValue}
          bg={bg}
          placeholder="Enter Description"
          fontSize={20}
        />

        <Button
          isLoading={loading}
          marginTop={5}
          loadingText="Uploading"
          colorScheme={"linkedin"}
          variant={`${loading ? "outline" : "solid"}`}
          width="xl"
          _hover={{ shadow: "lg" }}
          fontSize={20}
          onClick={() => uploadDetails()}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
