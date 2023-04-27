import { initialize } from "zokrates-js";
const verifyProof = async (keypair, proof) => {
    try {
        const zokratesProvider = await initialize();

        const isVerified = zokratesProvider.verify(keypair.vk, proof);
        
        return isVerified;
    } catch (err) {
        console.error(err);
    }
};

export {verifyProof};