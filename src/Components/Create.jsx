import { Flex, Input, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";

const Create = () => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.50");

  const [title, setTitle] = useState("");

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
      </Flex>
    </Flex>
  );
};

export default Create;
