import { Button, Flex, HStack } from "@chakra-ui/react";
import React from "react";
import { Image } from "@chakra-ui/react";
import MusicBg from "../assets/musicbg.jpg";
import { FcGoogle } from "react-icons/fc";

import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { doc, getFirestore, setDoc } from "firebase/firestore";

// ---------APP-----------------
const Login = () => {
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const firebaseDb = getFirestore(firebaseApp);
  // -------------Login Function----------
  const handleLogin = async () => {
    const { user } = await signInWithPopup(auth, provider);
    const { refreshToken, providerData } = user;

    // -------STORING refresh token and provider data  in local storage--------
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));

    // ----SAVING DETAILS TO FIRESTORE---------

    await setDoc(
      doc(firebaseDb, "users", providerData[0].uid),
      providerData[0]
    );

    //-----
    navigate("/", { replace: true });
  };

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
      position={"relative"}
    >
      <Image src={MusicBg} objectFit="cover" width={"full"} height={"full"} />
      <Flex
        position={"absolute"}
        width={"100vw"}
        height={"100vh"}
        bg={"blackAlpha.600"}
        top={0}
        left={0}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <HStack>
          <Button
            leftIcon={<FcGoogle fontSize={25} />}
            colorScheme={"whiteAlpha"}
            shadow={"lg"}
            color="#f1f1f1"
            onClick={() => {
              handleLogin();
            }}
          >
            SignIn with Google
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Login;

// 59m
