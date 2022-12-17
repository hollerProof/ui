import {fetchAccount, Field, isReady, Mina, PublicKey,} from 'snarkyjs'
import type {Holler} from '../../../contracts/build/Holler';
import {MerkleWitness9, Prompt} from "../../../lib/sparkyTypes";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

const state = {
    Holler: null as null | typeof Holler,
    zkapp: null as null | Holler,
    transaction: null as null | Transaction,
}

// ---------------------------------------------------------------------------------------

const functions = {
    loadSnarkyJS: async (args: {}) => {
        await isReady;
    },
    setActiveInstanceToBerkeley: async (args: {}) => {
        const Berkeley = Mina.BerkeleyQANet(
            "https://proxy.berkeley.minaexplorer.com/graphql"
        );
        Mina.setActiveInstance(Berkeley);
    },
    loadContract: async (args: {}) => {
        const { Holler } = await import('../../../contracts/build/Holler.js');
        state.Holler = Holler;
    },
    compileContract: async (args: {}) => {
        await state.Holler!.compile();
    },
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        state.zkapp = new state.Holler!(publicKey);
    },
    getProofRoot: async (args: {}) => {
        const currentProofRoot = await state.zkapp!.proofTree.get();
        return JSON.stringify(currentProofRoot.toJSON());
    },
    createAddToQueueTransaction: async (args: {salt: Field, prompt: Prompt, leafWitness: MerkleWitness9}) => {
        const transaction = await Mina.transaction(() => {
                state.zkapp!.addQueue(args.salt, args.prompt, args.leafWitness);
            }
        );
        state.transaction = transaction;
    },
    proveTransaction: async (args: {}) => {
        await state.transaction!.prove();
    },
    getTransactionJSON: async (args: {}) => {
        return state.transaction!.toJSON();
    },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
    id: number,
    fn: WorkerFunctions,
    args: any
}

export type ZkappWorkerResponse = {
    id: number,
    data: any
}
if (process.browser) {
    addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
        const returnData = await functions[event.data.fn](event.data.args);

        const message: ZkappWorkerResponse = {
            id: event.data.id,
            data: returnData,
        }
        postMessage(message)
    });
}