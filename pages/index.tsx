import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Button, Text, Flex } from "@chakra-ui/react";

const Home: NextPage = () => {
  // <link rel="icon" href="/favicon.ico" />

  return (
    <div>
      <Head>
        <title>Holler</title>
        <meta name="description" content="Proof for your prompts" />
      </Head>
      <Flex
        width={'full'}
        height={'100vh'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box>
          <Flex
            flexDir={"column"}
            pr={32}
            pb={4}
            minW={'600px'}
          >
            <Text fontSize={"4xl"}>Holler</Text>
            <Text fontSize={"2xl"}>Proof of your Prompts</Text>
          </Flex>

          <hr></hr>

          <br></br>
          <Flex gap={4}>
            <Text textAlign={'center'} fontSize={'xl'} p={8} color={'whiteAlpha.800'} borderRadius={8} background={"gray.500"} style={{
              
              userSelect: 'none'
            }}>MODELS</Text>
            <Flex flexDirection={'column'} gap={4} width={'full'}>
              <Button onClick={() => window.open('/stable-diffusion',"_self")} w={'full'}>Stable Diffusion</Button>
              <Button w={'full'}>more soon...</Button>
            </Flex>

          </Flex>
        </Box>
      </Flex>
    </div>

  );
}

export default Home;
