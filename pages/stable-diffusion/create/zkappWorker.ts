import {fetchAccount, Field, isReady, MerkleTree, MerkleWitness, Mina, Poseidon, PublicKey, Struct,} from 'snarkyjs'
import type {Holler} from 'holler_contracts';
import {MerkleWitness9, Prompt} from 'holler_contracts';
import { Witness } from 'snarkyjs/dist/node/lib/merkle_tree';
// import {Witness} from "snarkyjs/dist/web/lib/merkle_tree";
// import {MerkleWitness9, Prompt} from "../../../lib/sparkyTypes";

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// export class MerkleWitness9 extends MerkleWitness(9) {}

// export class Prompt extends Struct({
//     userPublicKey: PublicKey,
//     promptHash: Field,
//     status: Field
// }) {
//     hash(): Field {
//         return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, this.status]);
//     }
//
//     hashQueue(): Field {
//         return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, Field(0)]);
//     }
//
//     hashComplete(): Field {
//         return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, Field(1)]);
//     }
//     toFields(): Field[] {
//         return this.userPublicKey.toFields().concat(this.promptHash, this.status);
//     }
// }

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
        const { Holler } = await import('holler_contracts');
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
    createAddToQueueTransaction: async (args: {salt: number, userKey: string, leaves: string[], count: number, promptData: any}) => {
        console.log('createAddToQueueTransaction');
        const {salt: _salt, leaves: _leaves, promptData: _promptData, userKey, count} = args;
        // console.log('salt', _salt);
        // console.log('prompt', _prompt);
        // console.log('leafWitness', witness);
        const salt = Field(_salt);
        const ind = BigInt(count + 1);
        // const prompt = new Prompt(
        //     {
        //         userPublicKey: _prompt.userPublicKey,
        //         promptHash: _prompt.promptHash,
        //         status: _prompt.status,
        //     }
        // )
        let hashCode = function (s: any) {
            var h = 0, l = s.length, i = 0;
            if (l > 0)
                while (i < l)
                    h = (h << 5) - h + s.charCodeAt(i++) | 0;
            return h;
        };
        const prompt = new Prompt({
                userPublicKey: PublicKey.fromBase58(userKey),
                promptHash: Field(Poseidon.hash([Field(hashCode(JSON.stringify(_promptData)))])),
                status: Field(0)
            }
        );

        const leaves = _leaves!.map((leaf) => Field(leaf));

        const tree = new MerkleTree(9);
        tree.fill(leaves);

        const leafWitness = new MerkleWitness9(tree.getWitness(ind));


        // const leafWitness = new MerkleWitness9();
        // const ww = new Witness(witness);
        // const leafWitness = new MerkleWitness9(witness);
        // console.log('salt', salt);
        // console.log('prompt', prompt);
        // console.log('leafWitness', leafWitness);

        const transaction = await Mina.transaction(() => {
                state.zkapp!.addQueue(salt, prompt, leafWitness);
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