const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

/**
 * This function takes a public key as input and returns its corresponding address in hex format.
 * @param {*} publickey - The public key to derive the address from
 * @returns The address in hex format (0x....)
 */
const getAddress = (publickey) => {
  // Check if public key is not null or undefined
  if (!publickey) {
    throw new Error("Parameter 'publickey' cannot be null or undefined");
  }
  // Check if public key is a Uint8Array
  if (!(publickey instanceof Uint8Array)) {
    throw new Error("Expected parameter to be a Uint8Array");
  }
  // Check if public key is of expected length (65 bytes)
  if (publickey.length !== 65) {
    throw new Error("Expected public key to be 65 bytes");
  }
  // Derive address from public key and return it in hex format
  const address = "0x" + toHex(keccak256(publickey.slice(1)).slice(-20));
  return address;
};

module.exports = {
  getAddress,
};
