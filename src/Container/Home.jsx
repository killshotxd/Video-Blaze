import { Flex } from "@chakra-ui/react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  Category,
  Create,
  Feed,
  Navbar,
  VideoPin,
  Search,
} from "../Components";

const Home = ({ user }) => {
  return (
    <>
      <Navbar user={user} />

      <Flex
        direction={"column"}
        justifyContent="start"
        alignItems={"center"}
        width="20"
      >
        <Category />
      </Flex>

      <Flex width={"full"} justifyContent="center" alignItems={"center"} px="4">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/create" element={<Create />} />
          <Route path="/videoDetail/:videoId" element={<VideoPin />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Flex>
    </>
  );
};

export default Home;
