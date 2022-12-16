var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, method, Poseidon, PublicKey, SmartContract, State, state, Struct, MerkleWitness, Signature, Permissions, } from 'snarkyjs';
class Prompt extends Struct({
    userPublicKey: PublicKey,
    promptHash: Field,
    status: Field
}) {
    hash() {
        return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, this.status]);
    }
    hashQueue() {
        return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, Field(0)]);
    }
    hashComplete() {
        return Poseidon.hash([Poseidon.hash(this.userPublicKey.toFields()), this.promptHash, Field(1)]);
    }
    toFields() {
        return this.userPublicKey.toFields().concat(this.promptHash, this.status);
    }
}
class MerkleWitness9 extends MerkleWitness(9) {
}
export class Holler extends SmartContract {
    constructor() {
        super(...arguments);
        // @state(Field) num = State<Field>();
        this.proofTree = State();
        this.target = State();
        this.events = {
            proved: PublicKey,
        };
    }
    deploy(args) {
        super.deploy(args);
        const permissionToEdit = Permissions.proofOrSignature();
        this.setPermissions({
            ...Permissions.default(),
            editState: permissionToEdit
        });
    }
    init() {
        super.init();
        this.target.set(Field('17057234437185175411792943285768571642343179330449434169483610110583519635705'));
    }
    initState(commitment) {
        this.proofTree.set(commitment);
    }
    addQueue(salt, prompt, leafWitness) {
        // check leaf was empty
        leafWitness.calculateRoot(Field(0)).assertEquals(this.proofTree.get());
        this.target.assertEquals(this.target.get());
        Poseidon.hash([salt]).assertEquals(this.target.get());
        let commitment = this.proofTree.get();
        this.proofTree.assertEquals(commitment);
        // leafWitness.calculateRoot(Poseidon.hash([salt])).assertEquals(commitment);
        let newProofTree = leafWitness.calculateRoot(prompt.hashQueue());
        this.proofTree.set(newProofTree);
    }
    promptProof(prompt, leafWitness, adminSignature) {
        adminSignature
            .verify(this.address, prompt.toFields())
            .assertTrue();
        let commitment = this.proofTree.get();
        this.proofTree.assertEquals(commitment);
        leafWitness.calculateRoot(prompt.hashQueue()).assertEquals(commitment);
        let newProofTree = leafWitness.calculateRoot(prompt.hashComplete());
        this.proofTree.set(newProofTree);
    }
    removeFromQueue(prompt, leafWitness, adminSignature) {
        adminSignature
            .verify(this.address, prompt.toFields())
            .assertTrue();
        let proofTree = this.proofTree.get();
        this.proofTree.assertEquals(proofTree);
        leafWitness.calculateRoot(prompt.hashQueue()).assertEquals(proofTree);
        let newProofTree = leafWitness.calculateRoot(Field(0));
        this.proofTree.set(newProofTree);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Holler.prototype, "proofTree", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Holler.prototype, "target", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Holler.prototype, "init", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", void 0)
], Holler.prototype, "initState", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Prompt, MerkleWitness9]),
    __metadata("design:returntype", void 0)
], Holler.prototype, "addQueue", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Prompt, MerkleWitness9, Signature]),
    __metadata("design:returntype", void 0)
], Holler.prototype, "promptProof", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Prompt, MerkleWitness9, Signature]),
    __metadata("design:returntype", void 0)
], Holler.prototype, "removeFromQueue", null);
//# sourceMappingURL=Holler.js.map