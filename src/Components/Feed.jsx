import React, { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { getAllFeeds } from "../Utils/FetchData";
import Spinner from "../Components/Spinner";
import { Box, SimpleGrid } from "@chakra-ui/react";
import VideoPin from "./VideoPin";
const Feed = () => {
  // -------FIRESTORE DB INSTANCE--------

  const firestoreDb = getFirestore(firebaseApp);

  const [feeds, setFeeds] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllFeeds(firestoreDb).then((data) => {
      setFeeds(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner msg={"Loading your feeds...."} />;

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

export default Feed;
