import { Address, Hash, Hex, Log, verifyMessage } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * web3 sign message
 */
export async function web3SignMessage(
  message: string,
  privateKey?: string,
): Promise<string> {
  privateKey = privateKey ?? process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      'Private key not found in environment variables or as a function parameter',
    );
  }
  const key = ('0x' + privateKey) as Hex;
  const account = privateKeyToAccount(key);
  return account.signMessage({ message });
}

/**
 * web3 verify message
 */
export async function web3VerifyMessage(
  address: Address,
  message: string,
  signature: Hex,
): Promise<boolean> {
  return verifyMessage({ address, message, signature });
}

/**
 * record reader
 * * get log from contract
 */
type TLog = {
  txid: Hash;
  block: string;
  event: string;
  topic1: string;
  topic2: string;
  topic3: string;
  data: Hex;
  logIndex: string;
  meta: Log;
};
export async function recordReader(
  publicClient: any,
  contractAddress: string,
  startBlock: number,
  endBlock: number,
  args?: { topic1?: string; topic2?: string; topic3?: string },
): Promise<{ res: boolean; data: TLog[] }> {
  let res = false;
  let logs: TLog[] = [];
  try {
    const logOptions: Record<string, any> = {
      address: contractAddress as Address,
      fromBlock: BigInt(startBlock),
      toBlock: BigInt(endBlock),
    };

    if (args) {
      logOptions.args = args;
    }

    const rawRecords = await publicClient.getLogs(logOptions);
    if (rawRecords) {
      res = true;
      if (rawRecords.length > 0) {
        for (const record of rawRecords) {
          logs.push({
            txid: record.transactionHash,
            block: record.blockNumber,
            event: record.topics[0],
            topic1:
              record.topics[1] != undefined
                ? record.topics[1].replace('0x000000000000000000000000', '0x')
                : null,
            topic2:
              record.topics[2] != undefined
                ? record.topics[2].replace('0x000000000000000000000000', '0x')
                : null,
            topic3:
              record.topics[3] != undefined
                ? record.topics[3].replace('0x000000000000000000000000', '0x')
                : null,
            data: record.data,
            logIndex: record.logIndex,
            meta: record,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
  }

  return {
    res: res,
    data: logs,
  };
}
