import { generateProof } from "./zokrate-prover.js";
import { verifyProof } from "./zokrate-verifier.js";


const run = async () => {

    const {proof, keypair} = await generateProof();

    if(proof === null) {
        console.log("Prover cannot provide valid proof, Rejected.");
        return;
    } 

    const isVerified = await verifyProof(keypair, proof);
    console.log("Proof is " + (isVerified ? "valid" : "invalid"));
}

run();