import { initialize } from "zokrates-js";
import circuit from './circuit.js';
import sha256 from 'crypto-js/sha256.js';
import crypto from 'crypto';

// {private} private key
const pk = `MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgyTIfCYR723IrbQbkfoZ2triWeHC4jJvc3fUOOfD+6AyhRANCAASKweBkhPZ2T/Do4y0qaxhb7u82ALOafdrYlGuVDfz90qScrK5ab7jM6cBfW9hAL1GLTT0KndU6G/9fYyJWIahg`;

// {private} the prime generate from func generateRandomPrime
const randomPrime = 15499788129383367000;

// Since the circuit cannot take large number, we use this to reduce size of number for calculations.
const reducer = Number(1e9+7);

/**
 * 
 * @param {Number} ownerSign the modulus of privateKey mod primeDivider, signature of the patient
 * @returns {proof: the zksnark proof, keypair: private key (not the owner's privateKey) and verification key need to verify proof}
 */
const generateProof = async (ownerSign) => {
    try {

        const zokratesProvider = await initialize();

        const source = circuit;
        
        const artifacts = await zokratesProvider.compile(source);

        const keypair = await zokratesProvider.setup(artifacts.program);

        const verificationKey = keypair.vk;

        let proof = null;
    
        const res = await generateInput(pk);

        try {
            const { witness, output} = await zokratesProvider.computeWitness(artifacts, [`${res.privateKey}`, `${res.primeDivider}`, `${ownerSign}`]);
            proof = await zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
        } catch(err) {
            return {proof, verificationKey};
        }
        return {proof, verificationKey};
    } catch (err) {
        console.error(err);
    }
};


/**
 * 
 * @param {*} pk privateKey
 * @returns {object} res {privateKey: number, primeDivider: number, modulus: number}
 * NOTE: The modulus is the ownerSign that must be generate in the registration process of patient
 * before create EHRs as it serves as a digital signature that later we must proof.
 */
const generateInput = async (pk) => {
    const hashed_pk = sha256(pk)
    let privateKey = BigInt(`0x${hashed_pk}`)
    let primeDivider = randomPrime

    privateKey = Number(privateKey) % reducer;
    primeDivider = Number(primeDivider) % reducer;
    const modulus = privateKey % primeDivider;
    const res = {
        privateKey: privateKey,
        primeDivider: primeDivider,
        modulus: modulus
    }
    console.log("zokrate-prover/gen Input:");
    console.table(res);
    return res;
}

/**
 * This function generate a random primeDivider number to calculate the number ownerSign.
 * The prime generate from this function must be keeped and never change since it is used to generate input for the witness.
 */
const generateRandomPrime = async () => {
    crypto.generatePrime(64, {bigint: true}, (err, prime) => {
        console.log(Number(`zokrate-prover/generatePrime: ${prime}`)); // 60757n
        return prime;
    });
}

export {generateProof};