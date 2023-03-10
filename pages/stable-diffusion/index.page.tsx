import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Button, Text, Flex, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input } from "@chakra-ui/react";
import CreatePromptForm from '../../components/CreatePromptForm';
import { useState } from "react";


const StableDiffusion: NextPage = () => {
  // <link rel="icon" href="/favicon.ico" />
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [promptId, setPromptId] = useState<number | undefined>();
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
          <Text maxW={'600px'} textAlign={'right'} fontSize={"sm"}>To limit the usage of the Stable Diffusion API, prompt proofing is restricted to one per 20 minutes across the entire application. After you submit your proof, you will be added to the queue. Our oracle will run the model and add it the the chain. Total proof count is limited to 512</Text>

          <hr></hr>

          <br></br>
          <Flex gap={4}>
            <Flex flexDirection={'column'} gap={4} width={'full'}>
              <Button onClick={()=>window.open("/stable-diffusion/create", '_self')} w={'full'}>Create Prompt Proof</Button>
              <Flex gap={4}>
                <Button onClick={() => window.open('/stable-diffusion/prompts/mine', '_self')} w={'full'}>Your prompts</Button>
                <Button onClick={() => window.open('/stable-diffusion/prompts', '_self')} w={'full'}>Explore other prompts</Button>
              
              </Flex>
              
              <Flex gap={2}>
                <Input
            type="number"
            id="prompt_id"
            placeholder="Prompt ID"
            value={promptId}
            onChange={e => setPromptId(parseInt(e.target.value))}
                  width={'%25'}
          />
              <Button onClick={() => window.open('/stable-diffusion/prompt', '_self')} w={'full'}>Check Prompt Proof Status</Button>
              </Flex>
              
            </Flex>

          </Flex>
        </Box>
      </Flex>
    </div>

  );
}

export default StableDiffusion;
