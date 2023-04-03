import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey.length === 64) {
      try {
        const publickey = secp.getPublicKey(hexToBytes(privateKey));
        const address = toHex(keccak256(publickey.slice(1)).slice(-20));
        setAddress(`0x${address}`);
        if (address) {
          const {
            data: { balance },
          } = await server.get(`balance/${address}`);
          setBalance(balance);
        } else {
          setBalance(0);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type in a private key"
          maxLength={64}
          minLength={64}
          value={privateKey}
          onChange={onChange}
        />
      </label>
      <div>
        Address:{" "}
        {privateKey.length !== 64 ? "Not a valid private key!" : address}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
