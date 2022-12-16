import {
    Mina,
    isReady,
    PublicKey,
    PrivateKey,
    Field,
    fetchAccount, MerkleWitness,
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------
class MerkleWitness9 extends MerkleWitness(9) {}


import type { Holler } from '../contracts/Holler';

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
        const { Holler } = await import('../contracts/Holler.js');
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
    addToQueueTransaction: async (args: {}) => {
        const queueWitness = new MerkleWitness9(tree.getWitness(BigInt(0)));
        const transaction = await Mina.transaction(() => {
                state.zkapp!.add();
            }
        );
        state.transaction = transaction;
    },
    proveUpdateTransaction: async (args: {}) => {
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