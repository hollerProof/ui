import type {NextPage} from 'next'
import Head from 'next/head'
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import CreatePromptForm from '../../../components/CreatePromptForm';
import {useEffect, useState} from "react";
import ZkappWorkerClient from "./zkappWorkerClient";
import {Field, MerkleTree, Poseidon, PublicKey} from "snarkyjs";
import './reactCOIServiceWorker';
// import {MerkleWitness9, Prompt} from "../../../lib/sparkyTypes";
import {MerkleWitness9, Prompt} from 'holler_contracts';


let transactionFee = 0.1;


const StableDiffusion: NextPage = () => {
  // <link rel="icon" href="/favicon.ico" />
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [promptId, setPromptId] = useState<number | undefined>();
  const [promptData, setPromptData] = useState<any>();

  let [state, setState] = useState({
    zkappWorkerClient: null as null | ZkappWorkerClient,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentRootHash: null as null | Field,
    publicKey: null as null | PublicKey,
    zkappPublicKey: null as null | PublicKey,
    creatingTransaction: false,
    leaves: null as null | number[],
    count: null as null | number,
  });
  useEffect(() => {
    (async () => {
      if (!state.hasBeenSetup) {
        // fetch the leave from api
        const response = await fetch(`${process.env.APP_URL}/api/models/sd/leaves`);
        const data = await response.json();
        const leaves = data.leaves;
        const count = data.count;


        const zkappWorkerClient = new ZkappWorkerClient();

        console.log('Loading SnarkyJS...');
        await zkappWorkerClient.loadSnarkyJS();
        console.log('done');

        await zkappWorkerClient.setActiveInstanceToBerkeley();

        const mina = (window as any).mina;

        if (mina == null) {
          setState({...state, hasWallet: false});
          return;
        }

        const publicKeyBase58: string = (await mina.requestAccounts())[0];
        const publicKey = PublicKey.fromBase58(publicKeyBase58);

        console.log('using key', publicKey.toBase58());

        console.log('checking if account exists...');
        const res = await zkappWorkerClient.fetchAccount({publicKey: publicKey!});
        const accountExists = res.error == null;

        await zkappWorkerClient.loadContract();

        console.log('compiling zkApp');
        await zkappWorkerClient.compileContract();
        console.log('zkApp compiled');

        const zkappPublicKey = PublicKey.fromBase58('B62qpqAW5ABXpXP7v8wV2UsGiQYf2a9n9m1GKBcSjR423agdZ6R4954');

        await zkappWorkerClient.initZkappInstance(zkappPublicKey);

        console.log('getting zkApp state...');
        await zkappWorkerClient.fetchAccount({publicKey: zkappPublicKey})
        const currentRootHash = await zkappWorkerClient.getProofRoot();
        console.log('current state:', currentRootHash.toString());

        setState({
          ...state,
          zkappWorkerClient,
          hasWallet: true,
          hasBeenSetup: true,
          publicKey,
          zkappPublicKey,
          accountExists,
          currentRootHash,
          leaves,
          count,
        });
      }
    })();
  }, []);
  let hashCode = function (s: any) {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
  };
  const onSendTransaction = async () => {
    setState({...state, creatingTransaction: true});
    console.log('sending a transaction...');

    await state.zkappWorkerClient!.fetchAccount({publicKey: state.publicKey!});

    const prompt = new Prompt({
          userPublicKey: state.publicKey!,
          promptHash: Field(Poseidon.hash([Field(hashCode(JSON.stringify(promptData)))])),
          status: Field(0)
        }
    );
    const tree = new MerkleTree(9);
    const leaves = state.leaves!.map((leaf) => Field(leaf));
    tree.fill(leaves);
    const leafWitness = new MerkleWitness9(tree.getWitness(BigInt(state.count! + 1)));
    console.log('leafWitness', leafWitness);
    console.log('prompt', prompt);

    console.log("prompt", promptData);
    await state.zkappWorkerClient!.createAddToQueueTransaction(Field(22), prompt, leafWitness);

    console.log('creating proof...');
    await state.zkappWorkerClient!.proveTransaction();

    console.log('getting Transaction JSON...');
    const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON()

    console.log('requesting send transaction...');
    const {hash} = await (window as any).mina.sendTransaction({
      transaction: transactionJSON,
      feePayer: {
        fee: transactionFee,
        memo: '',
      },
    });

    console.log(
        'See transaction at https://berkeley.minaexplorer.com/transaction/' + hash
    );

    setState({...state, creatingTransaction: false});
  }


  return (
      <div>
        <Head>
          <title>Stable Diffusion</title>
          <meta name="description" content="Proof for your Stable diffusion prompts"/>
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
              <Text color={'pink.200'} fontSize={"md"}>Please wait until system ready for connection to blockchain</Text>
            </Flex>
            <Text maxW={'600px'} textAlign={'right'} fontSize={"sm"}>To limit the usage of the Stable Diffusion API, prompt proofing is restricted to one per 20 minutes across the entire application. After you submit your proof, you will be added to the queue. Our oracle will run the model and add it the the chain. Total proof count is limited to 512</Text>


            <hr></hr>

            <br></br>
            <Flex gap={4}>
              <Flex flexDirection={'column'} gap={4} width={'full'}>
                <Tooltip
                    label={state.hasBeenSetup && state.hasWallet ? 'Add your prompt to queue' : 'System is not set yet!'}>
                  <Button isDisabled={!state.hasBeenSetup} onClick={onOpen} w={'full'}>Add to Queue Prompt
                    Proof</Button>
                </Tooltip>
                <Flex gap={2}>
                  <Input
                      isDisabled={!state.hasBeenSetup}
                      type="number"
                      id="prompt_id"
                      placeholder="Prompt ID"
                      value={promptId}
                      onChange={e => setPromptId(parseInt(e.target.value))}
                      width={'%25'}
                  />
                  <Tooltip
                      label={state.hasBeenSetup ? 'Search for your prompt status (coming soon...)' : 'System is not set yet!'}>
                    <Button isDisabled={!state.hasBeenSetup}
                            onClick={() => window.open('/stable-diffusion/prompt', '_self')} w={'full'}>Check Prompt
                      Proof Status</Button>
                  </Tooltip>
                </Flex>

              </Flex>

            </Flex>
          </Box>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Create Prompt Proof</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <CreatePromptForm setData={setPromptData}/>
            </ModalBody>

            <ModalFooter>
              <Flex gap={4}>
                <Button colorScheme='blue' onClick={() => onSendTransaction()}>Create</Button>
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
