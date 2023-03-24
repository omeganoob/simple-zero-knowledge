import { initialize } from "zokrates-js";
import * as fs from 'fs';

const exportFile = (content) => {
  const filename = 'verifier.sol';

  fs.writeFile(filename, content, (err) => {
    if (err) throw err;
    console.log(`The file '${filename}' has been saved!`);
  });
}

const run = async () => {
  try {
    const zokratesProvider = await initialize();

    const source = `def main(u8 target, private u8 root) -> bool {
    return root * root == target;}`;

    const artifacts = zokratesProvider.compile(source);

    const { witness, output } = zokratesProvider.computeWitness(artifacts, ["0x04", "0x02"]);

    console.log(`output: ${output}`);

    const keypair = zokratesProvider.setup(artifacts.program);

    console.log(keypair);

    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);

    exportFile(verifier);

    const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

    console.log(`proof: ${JSON.stringify(proof.inputs, null, 4)}`);

    const isVerified = zokratesProvider.verify(keypair.vk, proof);

    console.log(`Is Verified: ${isVerified}`);

  } catch (err) {
    console.error(err);
  }
};
run();
