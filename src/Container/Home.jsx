import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Category,
  Create,
  Feed,
  Navbar,
  VideoPin,
  Search,
  VideoPinDetail,
} from "../Components";

import { categories } from "../Data";

const Home = ({ user }) => {
  return (
    <>
      <Navbar user={user} />

      <Flex width={"100vw"}>
        <Flex
          direction={"column"}
          justifyContent="start"
          alignItems={"center"}
          width="5%"
        >
          {categories &&
            categories.map((data) => <Category key={data.id} data={data} />)}
        </Flex>

        <Flex
          width={"95%"}
          px={4}
          justifyContent="center"
          alignItems={"center"}
        >
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/category/:categoryId" element={<Feed />} />
            <Route path="/create" element={<Create />} />
            <Route path="/videoDetail/:videoId" element={<VideoPinDetail />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
