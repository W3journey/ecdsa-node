const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { getAddress } = require("../utils/keyUtils");
const fs = require("fs");
const { accounts } = require("../accounts");

/**
 * Generates a new account and saves it to accounts.js
 */
const generateAccount = () => {
  // Generate private key and convert to hex string
  const privatekey = secp.utils.randomPrivateKey();
  const hexPrivateKey = toHex(privatekey);

  // Generate public key and convert to hex string
  const publickey = secp.getPublicKey(privatekey);
  const hexPublickey = toHex(publickey);

  // Generate address from public key
  const address = getAddress(publickey);

  // Log the private key, public key, and address to the console
  console.log("PrivateKey:", hexPrivateKey);
  console.log("Publickey:", hexPublickey);
  console.log("Address:", address);

  // Save the account to accounts.js
  saveAccount(hexPrivateKey, hexPublickey, address, balance);
};

/**
 * Saves the account information to accounts.js
 * @param {string} privateKey - the account's private key in hex string format
 * @param {string} publicKey - the account's public key in hex string format
 * @param {string} address - the account's address in hex string format
 * @param {number} balance - the account's balance
 */
const saveAccount = (privateKey, publicKey, address, balance) => {
  // Validate the balance input
  if (Number.isNaN(balance)) {
    throw new Error("Invalid balance input");
  }

  // Add the account to the accounts object
  accounts[address] = {
    privateKey: privateKey,
    publicKey: publicKey,
    balance: balance,
  };

  // Write the updated accounts object to accounts.js
  try {
    fs.writeFileSync(
      "./accounts.js",
      `module.exports = ${JSON.stringify({ accounts })}`
    );
    console.log("New account added to accounts.js successfully!");
  } catch (err) {
    console.log(err);
  }
};

// Get the balance from command line arguments or default to 0
const balance = process.argv[2] ? parseInt(process.argv[2]) : 0;

// Generate a new account with the specified balance
generateAccount(balance);
