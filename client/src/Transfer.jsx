import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const txData = "";
    const txDataBytes = utf8ToBytes(txData);
    const hashTxData = keccak256(txDataBytes);

    // get public key
    const publicKey = secp.getPublicKey(privateKey);

    // Create signature and recoveryBit
    const [signature, recoveryBit] = await secp.sign(hashTxData, privateKey, {
      recovered: true,
    });

    // Verify signature
    const verified = secp.verify(signature, hashTxData, publicKey);

    if (!verified) {
      alert("Signature no valid, check your private key!");
    } else {
      if (!recipient.startsWith("0x")) {
        alert("Not a valid address, it needs to start with 0x");
      } else {
        try {
          const {
            data: { balance },
          } = await server.post(`send`, {
            sender: address, // address formatted with 0x
            amount: parseInt(sendAmount),
            txData: toHex(hashTxData),
            signature: toHex(signature),
            recoveryBit: recoveryBit,
            publicKey: toHex(publicKey),
            recipient,
          });
          setBalance(balance);
        } catch (err) {
          alert(err.response.data.message);
        }
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient ("as 0x address")
        <input
          placeholder="An address, for example: 0x44dd4f52be9934b8a2149b97698a499d4fe41cdd"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
