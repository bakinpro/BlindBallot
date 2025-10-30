# BlindBallot

Anonymous on‑chain voting built on Zama FHEVM

BlindBallot is an anonymous voting stack. It combines Fully Homomorphic Encryption (FHE) with Zama’s FHEVM so that ballots are cast, tallied, and verified while choices remain encrypted end‑to‑end. Results are auditable; individual votes are not.

—

## Principles (what guides the design)
- Privacy first: no plaintext ballots on‑chain, ever
- Verifiable results: anyone can check tallies and election integrity
- Minimal trust: cryptography and Zama FHEVM replace trusted talliers
- Practical operations: clear runbooks for keys, audits, and incident response

—

## Capabilities
- Encrypted ballot casting with client‑side FHE
- On‑chain tally over ciphertexts (Zama FHEVM computation)
- Public proof artifacts for election verification
- Configurable election modes (single choice, approval, ranked — off‑chain prep/encoding)

### Non‑goals (intentionally out of scope)
- Voter identity management/KYC (integrate externally if required)
- Coercion‑resistant protocols (research track)
- Complex tally rules beyond the published encodings

—

## Threat model (high‑level)
Adversary can:
- Observe the chain/mempool, scrape events and state
- Interact with contracts, spam transactions
- Compromise a minority of infrastructure nodes

We mitigate by:
- Encrypting all ballot payloads with FHE (no useful plaintext on‑chain)
- Performing tally as FHEVM computation (no decryption during tally)
- Publishing verification artifacts for public checking
- Supporting per‑election key rotation and scoped authorities

—

## How it works (three flows)
1) Cast
   1. Client encodes selection → FHE encrypts using election public key
   2. Sends encrypted ballot to contract
   3. Contract stores ciphertext and emits commitment

2) Tally
   1. After close, contract aggregates ballots homomorphically (Zama FHEVM)
   2. Produces encrypted tally plus verification artifacts

3) Reveal result
   1. Authorized tally authority (or threshold group) reveals final tally value(s)
   2. Public verifies commitment consistency and proof artifacts

ASCII sketch
```
Voter → FHE Encrypt → Encrypted Ballot → FHEVM Tally → Encrypted Result → Verified Reveal
```

—

## Quick start (concise)
Prereqs: Node.js 18+, MetaMask, Sepolia ETH

```
git clone https://github.com/bakinpro/BlindBallot
cd BlindBallot
npm i && cp .env.example .env.local
npm run deploy:sepolia
npm run dev
```

—

## Operational runbook
- Key rotation
  - Generate new election FHE public key per election
  - Keep private key offline; restrict reveal to scoped authority/threshold
- Audits
  - Audit both Solidity and FHE circuit/encoding
  - Reproducible builds; pin versions and hashes
- Incidents
  - If mempool metadata leakage suspected, rotate election immediately
  - If reveal authority compromised, invalidate reveal and re‑tally under new keys

—

## Interfaces (high level)
- cast(bytes ciphertext)
- closeElection()
- tally()
- reveal(bytes proof, bytes result)
- getCommitment(uint idx) → bytes32
- getArtifacts() → bytes

Implementation note: all sensitive payloads are produced/consumed as ciphertexts; only final results are revealed.

—

## FAQ
- Does the contract ever decrypt ballots?
  - No. Tally runs over ciphertexts inside Zama FHEVM. Only the final tally value is revealed.
- Can observers link a ballot to a voter?
  - Linkability depends on your identity layer and submission pattern. Use relayers/mixers for stronger unlinkability.
- How do we support ranked voting?
  - Encode the ranking into the plaintext vector before FHE encryption. The provided circuits support common encodings.

—

## Glossary
- FHE (Fully Homomorphic Encryption): compute on encrypted data
- Zama FHEVM: EVM runtime extended with homomorphic operations
- Ciphertext: encrypted representation of a message/ballot
- Artifact: data used to verify that the tally is consistent with ballots

—

## Credits & License
Powered by Zama FHEVM and open cryptographic research.

MIT — see LICENSE.
