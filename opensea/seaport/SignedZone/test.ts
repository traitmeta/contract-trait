import { keccak256, recoverAddress, toUtf8Bytes } from "ethers/lib/utils";
import { ethers, Wallet, utils } from "ethers";
import { assert } from "console";

const ZoneContractAddress = "";
const chainId = 1;
const domainData = {
  name: "SignedZone",
  version: "1.0",
  chainId: chainId,
  verifyingContract: ZoneContractAddress,
};

const signedOrderType = {
  SignedOrder: [
    { name: "fulfiller", type: "address" },
    { name: "expiration", type: "uint64" },
    { name: "orderHash", type: "bytes32" },
    { name: "context", type: "bytes" },
  ],
};

const convertSignatureToEIP2098 = (signature: string) => {
  if (signature.length === 130) {
    return signature;
  }

  assert(signature.length == 132, "signature must be 64 or 65 bytes");
  return utils.splitSignature(signature).compact;
};

const toPaddedBytes = (value: number, numBytes = 32) =>
  ethers.BigNumber.from(value)
    .toHexString()
    .slice(2)
    .padStart(numBytes * 2, "0");

const calculateSignedOrderHash = (
  fulfiller: string,
  expiration: number,
  orderHash: string,
  context: string
) => {
  const signedOrderTypeString =
    "SignedOrder(address fulfiller,uint64 expiration,bytes32 orderHash,bytes context)";
  const signedOrderTypeHash = keccak256(toUtf8Bytes(signedOrderTypeString));

  const signedOrderHash = keccak256(
    "0x" +
      [
        signedOrderTypeHash.slice(2),
        fulfiller.slice(2).padStart(64, "0"),
        toPaddedBytes(expiration),
        orderHash.slice(2),
        keccak256(context).slice(2),
      ].join("")
  );

  return signedOrderHash;
};

const signOrder = async (
  orderHash: string,
  context: string = "0x",
  signer: Wallet,
  domainSeparator: string,
  fulfiller = ethers.constants.AddressZero,
  secondsUntilExpiration = 60
) => {
  const expiration = Math.round(Date.now() / 1000) + secondsUntilExpiration;
  const signedOrder = { fulfiller, expiration, orderHash, context };
  let signature = await signer._signTypedData(
    domainData,
    signedOrderType,
    signedOrder
  );

  signature = convertSignatureToEIP2098(signature);
  assert(signature.length == 2 + 64 * 2, "signature errer of length"); // 0x + 64 bytes

  const signedOrderHash = calculateSignedOrderHash(
    fulfiller,
    expiration,
    orderHash,
    context
  );
  const digest = keccak256(
    `0x1901${domainSeparator.slice(2)}${signedOrderHash.slice(2)}`
  );

  const recoveredAddress = recoverAddress(digest, signature);
  assert(recoveredAddress == signer.address, "recover address error");

  // extraData to be set on the order, according to SIP-7
  const extraData = `0x${fulfiller.slice(2)}${toPaddedBytes(
    expiration,
    8
  )}${signature.slice(2)}${context.slice(2)}`;

  return { signature, expiration, extraData };
};
