import { generateProof } from "./zokrate-prover.js";
import { verifyProof } from "./zokrate-verifier.js";

// This is the modulus generate from patient's registration. 
const ownerSign = 806280540;

const run = async () => {

    const {proof, verificationKey} = await generateProof(ownerSign);

    if(proof === null) {
        console.log("Prover cannot provide valid proof, Rejected.");
        return;
    } 
    
    const isVerified = await verifyProof(verificationKey, proof);

    console.log("main/Proof is " + (isVerified ? "valid" : "invalid"));
}

run();