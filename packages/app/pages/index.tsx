import React, { useEffect, useState } from "react";

import { Box, Container, Flex, HStack, Text, Stack, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import dynamic from "next/dynamic";
import p5Types from "p5";

import { useAccount, useSigner } from "wagmi";

import { equipmentABI } from "../lib/abi/equipment";
import { materialABI } from "../lib/abi/material";
import { ethers } from "ethers";
import { equipmentAddress, materialAddress } from "../lib/contract";

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
});

export default function Home() {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [mode, setMode] = useState<"loading" | "none" | "select" | "move">("loading");
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState("");

  const [balance, setBalance] = useState("");

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight / 1.5).parent(canvasParentRef);
    p5.strokeWeight(2);
    p5.ellipseMode(p5.RADIUS);
  };

  const draw = (p5: p5Types) => {
    let c1 = p5.color(255, 204, 0);
    let c2 = p5.color(20, 60, 0);
    let c3 = p5.color(43, 250, 70);

    p5.background(204);

    // Neck
    p5.stroke(c3); // Set stroke to gray
    p5.line(266, 257, 266, 162); // Left
    p5.line(276, 257, 276, 162); // Middle
    p5.line(286, 257, 286, 162); // Right

    // Antennae
    p5.line(276, 155, 246, 112); // Small
    p5.line(276, 155, 306, 56); // Tall
    p5.line(276, 155, 342, 170); // Medium

    // Body
    p5.noStroke(); // Disable stroke
    p5.fill(c1); // Set fill to gray
    p5.ellipse(264, 377, 33, 33); // Antigravity orb
    p5.fill(c2); // Set fill to black
    p5.rect(219, 257, 90, 120); // Main body
    p5.fill(c1); // Set fill to gray
    p5.rect(219, 274, 90, 6); // Gray stripe

    p5.fill(c2); // Set fill to black
    p5.ellipse(276, 155, 45, 45); // Head
    p5.fill(255); // Set fill to white
    p5.ellipse(288, 150, 14, 14); // Large eye
    p5.fill(c2); // Set fill to black
    p5.ellipse(288, 150, 3, 3); // Pupil
    p5.fill(153); // Set fill to light gray
    p5.ellipse(263, 148, 5, 5); // Small eye 1
    p5.ellipse(296, 130, 4, 4); // Small eye 2
    p5.ellipse(305, 162, 3, 3); // Small eye 3
  };

  const mint = async () => {
    if (!signer) {
      return;
    }
    const contract = new ethers.Contract(equipmentAddress, equipmentABI, signer);
    const value = ethers.utils.parseEther("0.01");
    await contract.mint({ value });
  };

  const selectEquipment = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setMode("move");
  };

  const move = async (dir: number) => {
    if (!signer) {
      return;
    }

    try {
      const contract = new ethers.Contract(equipmentAddress, equipmentABI, signer);
      await contract.move(selectedTokenId, dir);
    } catch (e) {
      alert("need to wait cooldown time!");
    }
  };

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider("https://api.testnet-dev.trust.one/");
    const contract = new ethers.Contract(equipmentAddress, equipmentABI, provider);

    const material = new ethers.Contract(materialAddress, materialABI, provider);

    const filter = contract.filters.Mined();
    contract.queryFilter(filter).then((logs) => {
      console.log(logs);
      const tokenIds = Array.from(new Set(logs.map((log) => log.args!.tokenId)));
      if (tokenIds.length === 0) {
        setMode("none");
      } else {
        setTokenIds(tokenIds);
        setMode("select");
      }
    });

    material.balanceOf(address).then((balance: any) => {
      setBalance(balance.toString());
    });
  }, [address]);

  useEffect(() => {
    if (mode !== "move") {
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider("https://api.testnet-dev.trust.one/");
    const contract = new ethers.Contract(equipmentAddress, equipmentABI, provider);
    contract.locations(selectedTokenId).then((location: any) => {
      console.log(location);
    });
  }, [mode, selectedTokenId]);

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
      {mode === "loading" && (
        <>
          <Container maxW="2xl" mb="4">
            <Box py="4" px="4" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}>
              <Text fontSize="xl" fontWeight={"bold"} textAlign="center">
                Loading...
              </Text>
            </Box>
          </Container>
        </>
      )}
      {mode === "none" && (
        <>
          <Container maxW="2xl" mb="4">
            <Box py="4" px="4" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}>
              <Stack>
                <Text fontSize="xl" fontWeight={"bold"} textAlign="center" mb="4">
                  You don&apos;t have equipment yet
                </Text>
                <Button onClick={mint}>Mint (0.01 ETH)</Button>
              </Stack>
            </Box>
          </Container>
        </>
      )}
      {mode === "select" && (
        <>
          <Container maxW="2xl" mb="4">
            <Box py="4" px="4" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}>
              <Stack>
                {tokenIds.map((tokenId) => {
                  return (
                    <Button
                      key={tokenId}
                      boxShadow={"base"}
                      borderRadius="2xl"
                      onClick={() => selectEquipment(tokenId)}
                    >
                      TokenID: {tokenId.toString()}
                    </Button>
                  );
                })}
                <Button onClick={mint}>Mint (0.01 ETH)</Button>
              </Stack>
            </Box>
          </Container>
        </>
      )}
      {mode === "move" && (
        <>
          <Stack mb="4">
            <Sketch setup={setup} draw={draw} />
          </Stack>
          <Container maxW="2xl" mb="4" position="relative">
            <Stack position={"absolute"} top="-40">
              <Text fontWeight="bold">Current Location</Text>
              <Text fontSize="xs">Searching...</Text>
              <Text fontWeight="bold">Material Balance</Text>
              <Text fontSize="xs">{ethers.utils.formatEther(balance)} TMM</Text>
            </Stack>
            <Box py="4" px="4" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}>
              <Text fontSize="xl" fontWeight={"bold"} mb="4" textAlign="center">
                Direction
              </Text>
              <HStack>
                <Button w="full" onClick={() => move(3)}>
                  Back
                </Button>
                <Button w="full" onClick={() => move(1)}>
                  Left
                </Button>
                <Button w="full" onClick={() => move(0)}>
                  Right
                </Button>
                <Button w="full" onClick={() => move(2)}>
                  Front
                </Button>
              </HStack>
            </Box>
          </Container>
        </>
      )}
    </Flex>
  );
}
