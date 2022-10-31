import React from "react";

import { Box, Container, Flex, HStack, Text, Stack, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import dynamic from "next/dynamic";
import p5Types from "p5";

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
});

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
      <Stack mb="4">
        <Sketch setup={setup} draw={draw} />
      </Stack>
      <Container maxW="2xl" mb="4">
        <Box py="4" px="4" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}>
          <Text fontSize="xl" fontWeight={"bold"} mb="4" textAlign="center">
            Direction
          </Text>
          <HStack>
            <Button w="full">Back</Button>
            <Button w="full">Left</Button>
            <Button w="full">Right</Button>
            <Button w="full">Front</Button>
          </HStack>
        </Box>
      </Container>
    </Flex>
  );
}
