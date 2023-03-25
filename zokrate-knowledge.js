import { initialize } from "zokrates-js";
import * as fs from 'fs';

const exportFile = (content) => {
    const filename = 'knowledge_verifier.sol';

    fs.writeFile(filename, content, (err) => {
        if (err) throw err;
        console.log(`The file '${filename}' has been saved!`);
    });
}

const run = async () => {
    try {
        const zokratesProvider = await initialize();

        const source = `
        import "hashes/sha256/512bitPacked" as sha256packed;
        def main(private field a, private field b, private field c, private field d) {
            field[2] h = sha256packed([a, b, c, d]);
            assert(h[0] == 263561599766550617289250058199814760685);
            assert(h[1] == 65303172752238645975888084098459749904);
            return;
        }`;

        const artifacts = zokratesProvider.compile(source);

        const keypair = zokratesProvider.setup(artifacts.program);

        console.log(keypair);

        const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);

        exportFile(verifier);

        const { witness, output } = zokratesProvider.computeWitness(artifacts, ["0", "0", "0", "5"]);

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
