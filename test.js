import { initialize } from "zokrates-js";
import circuit from "./circuit.js";

const run = async () => {
    try {
        const zokratesProvider = await initialize();

        const source = circuit;

        const artifacts = zokratesProvider.compile(source);

        const keypair = zokratesProvider.setup(artifacts.program);

        console.log(keypair);

        const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2", "4"]);

        console.log(`output: ${output}`);

        const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

        console.log(`proof: ${JSON.stringify(proof.inputs, null, 4)}`);

        const isVerified = zokratesProvider.verify(keypair.vk, proof);

        console.log(`Is Verified: ${isVerified}`);

    } catch (err) {
        console.error(err);
    }
};

run();