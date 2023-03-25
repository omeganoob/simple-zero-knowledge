import { initialize } from "zokrates-js";

const run = async () => {
    try {
      const zokratesProvider = await initialize();
  
      const source = `
            import "hashes/sha256/512bitPacked" as sha256packed;

            def main(private field a, private field b, private field c, private field d) -> field[2] {
                field[2] h = sha256packed([a, b, c, d]);
                return h;
        }`;
  
      const artifacts = zokratesProvider.compile(source);
  
      const { witness, output } = zokratesProvider.computeWitness(artifacts, ["0", "0", "0", "5"]);

      console.log(`output: ${output}`);
  
    } catch (err) {
      console.error(err);
    }
  };
  run();
