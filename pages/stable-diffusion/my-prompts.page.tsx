import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Button, Text, Flex, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Link, Image, Heading, SimpleGrid, FormControl, Input } from "@chakra-ui/react";
import ExploreGrid from "../../components/ExploreGrid";
import { useState, useEffect } from "react";

const Prompts: NextPage = (props: any) => {
  // <link rel="icon" href="/favicon.ico" />

  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   console.log(props)
  // }, []);

  return (
    <Flex
        width={'full'}
        height={'100vh'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
    <Box maxW={{sm: '400px', md: '600px', lg: '800px' }} >
    <Button size={'xs'} colorScheme={'pink'} onClick={() => window.open('/stable-diffusion', '_self')}>{'<'} Go Back</Button>
    <Flex justifyContent={'space-between'} alignItems={'baseline'} mb={4} gap={24}>
    <Text fontSize={'6xl'}>Your Prompts</Text>
      <FormControl>
          <Input
            type="text"
            id="search"
            placeholder="Search prompts by tags"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </FormControl>
    </Flex>
      <Box width={'full'}>
              <ExploreGrid data={props.data}/>

      </Box>
    </Box>
      </Flex>

  );
}
export async function getServerSideProps() {
  const res_ = await fetch(`${process.env.APP_URL}/api/prompts`);
  let data;
  if (res_.status !== 200) {
    console.log('error', res_.text());
    data = []
  }
  try {
      const data = await res_.json();
  } catch (e) {
        console.log('error', e);
        data = []
  }

  return {
    props: {
      // Pass the data to the page component as props
      data,
    },
  }
}

export default Prompts;
