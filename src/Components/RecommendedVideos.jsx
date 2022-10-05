import React, { useEffect, useState } from "react";

import { getAllFeeds } from "../Utils/FetchData";
import Spinner from "../Components/Spinner";
import { Box, SimpleGrid } from "@chakra-ui/react";
import VideoPin from "./VideoPin";

const RecommendedVideos = ({ feeds }) => {
  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width={"full"}
      autoColumns="max-content"
      px={"2"}
      overflowX="hidden"
    >
      {feeds &&
        feeds.map((data) => (
          <VideoPin key={data.id} maxWidth={420} height="80px" data={data} />
        ))}
    </SimpleGrid>
  );
};

export default RecommendedVideos;
