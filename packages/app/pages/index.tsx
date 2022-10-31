import { Box, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import React from "react";

export default function Home() {
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Container as="section" maxW="8xl" mb="8">
        <Box as="nav" py="4">
          <Flex justify="space-between" alignItems={"center"} h="8">
            <Text fontSize="lg" fontWeight={"bold"}>
              Terra Minors
            </Text>
            <HStack>
              <ConnectButton accountStatus={"full"} showBalance={false} chainStatus={"name"} />
            </HStack>
          </Flex>
        </Box>
      </Container>
      <Container maxW="2xl">
        <Box py="8" px="8" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}></Box>
      </Container>
    </Flex>
  );
}
