import { initialize } from "zokrates-js";

const verifyProof = async (verificationKey, proof) => {
    try {
        const zokratesProvider = await initialize();

        const isVerified = zokratesProvider.verify(verificationKey, proof);
        
        return isVerified;
    } catch (err) {
        console.error(err);
    }
};

export {verifyProof};