import { Field, PublicKey, SmartContract, State, Signature } from 'snarkyjs';
declare const Prompt_base: (new (value: {
    userPublicKey: PublicKey;
    promptHash: Field;
    status: Field;
}) => {
    userPublicKey: PublicKey;
    promptHash: Field;
    status: Field;
}) & import("snarkyjs/dist/node/snarky").ProvablePure<{
    userPublicKey: PublicKey;
    promptHash: Field;
    status: Field;
}> & {
    toInput: (x: {
        userPublicKey: PublicKey;
        promptHash: Field;
        status: Field;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        userPublicKey: PublicKey;
        promptHash: Field;
        status: Field;
    }) => {
        userPublicKey: string;
        promptHash: string;
        status: string;
    };
    fromJSON: (x: {
        userPublicKey: string;
        promptHash: string;
        status: string;
    }) => {
        userPublicKey: PublicKey;
        promptHash: Field;
        status: Field;
    };
};
declare class Prompt extends Prompt_base {
    hash(): Field;
    hashQueue(): Field;
    hashComplete(): Field;
    toFields(): Field[];
}
declare const MerkleWitness9_base: typeof import("snarkyjs/dist/node/lib/merkle_tree").BaseMerkleWitness;
declare class MerkleWitness9 extends MerkleWitness9_base {
}
export declare class Holler extends SmartContract {
    proofTree: State<Field>;
    target: State<Field>;
    events: {
        proved: typeof Field;
    };
    init(): void;
    initState(proofTree: Field, adminSignature: Signature): void;
    addQueue(salt: Field, prompt: Prompt, leafWitness: MerkleWitness9): void;
    promptProof(prompt: Prompt, leafWitness: MerkleWitness9, adminSignature: Signature): void;
    removeFromQueue(prompt: Prompt, leafWitness: MerkleWitness9, adminSignature: Signature): void;
}
export {};
