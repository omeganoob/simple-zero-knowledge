# Zero-Knowledge Proof
### Prerequisites
- privateKey: Patient's private key
- primeDivider: A random, not change prime number for generate owner sign
- ownerSign: A modulus of privateKey and primeDivider
- Circuit: The zokrate program to generate a proof

### Proof
1. In the registration process, The patient must generate the PrivateKey, primeDivier and ownerSign. The ownerSign must attach with the EHRs as a signature of its owner.
2. The patient can start generate the zk proof using the generateProof(ownerSign):
    - If successfully, its return a zksnark proof and a verification key. Anyone can use them to verify the proof is valid or not. The main program will take the result then.
    - If not, the proof will be null, thus the main program will stop. The verifier only check an "Properly Proof object" is valid or not, not check if it is null or wrong type anyway.
3. (Optional) Since we use ZK-Snark, the proof and its verification key can be genrate only once and stored to use anytime without the patient being online to generate it again.