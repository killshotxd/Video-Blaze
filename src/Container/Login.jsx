import { Flex } from "@chakra-ui/react";
import React from "react";
import { Image } from "@chakra-ui/react";
import MusicBg from "../assets/musicbg.jpg";
const Login = () => {
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
      position={"relative"}
    >
      <Image src={MusicBg} objectFit="cover" width={"full"} height={"full"} />
    </Flex>
  );
};

export default Login;

// 48:22
