import {Field, MerkleWitness, Poseidon, PublicKey, Struct} from "snarkyjs";

export class Prompt extends Struct({
    userPublicKey: PublicKey,
    promptHash: Field,
    status: Field
}) {
    hash(): Field {
        return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, this.status]);
    }

    hashQueue(): Field {
        return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, Field(0)]);
    }

    hashComplete(): Field {
        return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, Field(1)]);
    }

    toFields(): Field[] {
        return this.userPublicKey.toFields().concat(this.promptHash, this.status);
    }
} // ---------------------------------------------------------------------------------------
export class MerkleWitness9 extends MerkleWitness(9) {
}