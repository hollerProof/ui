import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Button, Text, Flex, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input } from "@chakra-ui/react";
import CreatePromptForm from '../../components/CreatePromptForm';
import { useState } from "react";


const StableDiffusion: NextPage = () => {
  // <link rel="icon" href="/favicon.ico" />
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [promptId, setPromptId] = useState();
  return (
    <div>
      <Head>
        <title>Stable Diffusion</title>
        <meta name="description" content="Proof for your Stable diffusion prompts" />
      </Head>
      <Flex
        width={'full'}
        height={'100vh'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box>
          <Button size={'xs'} colorScheme={'pink'} onClick={() => window.open('/', '_self')}>{'<'} Go Back</Button>
          <Flex
            flexDir={"column"}
            pr={32}
            pb={4}
            w={'600px'}
          >
            <Text fontSize={"4xl"}>Stable Diffusion</Text>
            <Text fontSize={"2xl"}>Proof of your Stable Diffusion Prompts</Text>
          </Flex>
          <Text maxW={'600px'} textAlign={'right'} fontSize={"sm"}>Prompt Proofing is limited to 1 per 20 minute application wide, to limit the Stable Diffusion api usage. After your proof submission you are added to the queue</Text>

          <hr></hr>

          <br></br>
          <Flex gap={4}>
            <Flex flexDirection={'column'} gap={4} width={'full'}>
              <Button onClick={onOpen} w={'full'}>Create Prompt Proof</Button>
              <Flex gap={4}>
                <Button onClick={() => window.open('/stable-diffusion/my-prompts', '_self')}w={'full'}>Your prompts</Button>
                <Button onClick={() => window.open('/stable-diffusion/prompts', '_self')}w={'full'}>Explore other prompts</Button>
              
              </Flex>
              
              <Flex gap={2}>
                <Input
            type="number"
            id="prompt_id"
            placeholder="Prompt ID"
            value={promptId}
            onChange={e => setPromptId(e.target.value)}
                  width={'%25'}
          />
              <Button onClick={() => window.open('/stable-diffusion/prompt', '_self')} w={'full'}>Check Prompt Proof Status</Button>
              </Flex>
              
            </Flex>

          </Flex>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Prompt Proof</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreatePromptForm/>
          </ModalBody>

          <ModalFooter>
            <Flex gap={4}>
              <Button colorScheme='blue'>Create</Button>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            </Flex>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );
}

export default StableDiffusion;
