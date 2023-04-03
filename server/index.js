const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { accounts } = require("./accounts");

app.use(cors());
app.use(express.json());

/**
 * @dev Accounts are stored in the accounts.js file
 */

// Get account balance for specified address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const hexAddress = "0x" + address;
  const balance = accounts[hexAddress].balance || 0;
  res.send({ balance });
});

// Send funds from one account to another
app.post("/send", (req, res) => {
  try {
    const {
      sender,
      recipient,
      amount,
      txData,
      signature,
      recoveryBit,
      publicKey,
    } = req.body;

    // Input validation
    if (
      !sender ||
      !recipient ||
      !amount ||
      !txData ||
      !signature ||
      !recoveryBit.toString() ||
      !publicKey
    ) {
      const errorMessage = "Missing required parameters";
      console.log(errorMessage);
      throw new Error(errorMessage);
    }

    // Recover public key
    const hashTxData = hexToBytes(txData);
    const signatureBytes = hexToBytes(signature);

    const recoveredPublicKey = secp.recoverPublicKey(
      hashTxData,
      signatureBytes,
      recoveryBit
    );

    const verified = secp.verify(
      signatureBytes,
      hashTxData,
      toHex(recoveredPublicKey)
    );

    setInitialBalance(sender);
    setInitialBalance(recipient);

    // Verify sender's authorization and sufficient balance
    if (!verified) {
      res
        .status(400)
        .send({ message: "You are not authorized to use this account" });
    }

    if (verified && toHex(recoveredPublicKey) === publicKey) {
      if (accounts[sender].balance < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        accounts[sender].balance -= amount;
        accounts[recipient].balance += amount;
        res.send({ balance: accounts[sender].balance });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!accounts[address].balance) {
    accounts[address].balance = 0;
  }
}
