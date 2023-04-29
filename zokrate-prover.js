import { initialize } from "zokrates-js";
import circuit from './circuit.js';
import sha256 from 'crypto-js/sha256.js';
import Base64 from 'crypto-js/enc-base64.js';

// {private} private key
const pk = `MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgyTIfCYR723IrbQbkfoZ2triWeHC4jJvc3fUOOfD+6AyhRANCAASKweBkhPZ2T/Do4y0qaxhb7u82ALOafdrYlGuVDfz90qScrK5ab7jM6cBfW9hAL1GLTT0KndU6G/9fYyJWIahg`;

// {private} save for later calculation
const randomPrime = 9301885781432487061;

const generateProof = async () => {
    try {

        const zokratesProvider = await initialize();

        const source = circuit;
        
        const artifacts = await zokratesProvider.compile(source);

        const keypair = await zokratesProvider.setup(artifacts.program);

        let proof = null;
    
        const res = await generateInput(pk);

        console.log(res)

        try {
            const { witness, output} = await zokratesProvider.computeWitness(artifacts, [`${res.privateKey}`, `${res.primeDivider}`, `${res.modulus}`]);
            console.log("output: " + output);
            proof = await zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
        } catch(err) {
            return {proof, keypair};
        }

        return {proof, keypair};
    } catch (err) {
        console.error(err);
    }
};

const generateInput = async (pk) => {
    const hashed_pk = sha256(pk)
    const privateKey = BigInt(`0x${hashed_pk}`)
    const primeDivider = randomPrime
     //can be use as the signature;
    // const modulus = privateKey % primeDivider;
    const res = {
        privateKey: Number(privateKey),
        primeDivider: Number(primeDivider),
        modulus: Number(privateKey) % Number(primeDivider)
    }

    return res;
}
export {generateProof};