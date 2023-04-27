import { initialize } from "zokrates-js";
import circuit from './circuit.js';

const generateProof = async () => {
    try {
        const zokratesProvider = await initialize();

        const source = circuit;
        
        const artifacts = await zokratesProvider.compile(source);

        const keypair = await zokratesProvider.setup(artifacts.program);

        let proof = null;

        try {
            const { witness, output} = await zokratesProvider.computeWitness(artifacts, ["2", "5", "10"]);
            proof = await zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
        } catch(err) {
            return {proof, keypair};
        }

        return {proof, keypair};
    } catch (err) {
        console.error(err);
    }
};

generateProof();

export {generateProof};