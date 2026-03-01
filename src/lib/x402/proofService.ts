import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  Address,
  Hex,
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ProofRecord } from "@/lib/x402/types";
import { HelloGoatError, hints, translatePaymentError } from "@/lib/x402/errors";

const dataDir = path.join(process.cwd(), "data");
const proofsFilePath = path.join(dataDir, "proofs.json");

async function ensureProofFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(proofsFilePath, "utf-8");
  } catch {
    await writeFile(proofsFilePath, JSON.stringify([], null, 2), "utf-8");
  }
}

async function appendProofRecord(proof: ProofRecord) {
  await ensureProofFile();
  const raw = await readFile(proofsFilePath, "utf-8");
  let proofs: ProofRecord[] = [];
  try {
    proofs = JSON.parse(raw);
  } catch {
    proofs = [];
  }
  proofs.push(proof);
  await writeFile(proofsFilePath, JSON.stringify(proofs, null, 2), "utf-8");
}

export async function executeHelloGoatPayment(invoiceId: string): Promise<ProofRecord> {
  const config = loadConfig();

  const privateKey: Hex = config.privateKeyRaw.startsWith("0x")
    ? (config.privateKeyRaw as Hex)
    : ("0x" + config.privateKeyRaw) as Hex;

  try {
    const probeClient = createPublicClient({
      transport: http(config.rpcUrl),
    });

    const chainId = await probeClient.getChainId();
    const chain = defineChain({
      id: Number(chainId),
      name: "Hello GOAT",
      network: "x402",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: { http: [config.rpcUrl] },
        public: { http: [config.rpcUrl] },
      },
    });

    const publicClient = createPublicClient({
      chain,
      transport: http(config.rpcUrl),
    });

    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(config.rpcUrl),
    });

    const txHash = await walletClient.sendTransaction({
      account,
      chain,
      to: config.receiver,
      value: parseEther("0.000001"),
    });
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    const proof: ProofRecord = {
      invoiceId,
      txHash,
      explorerUrl: `${config.explorerBase}/tx/${txHash}`,
      settledAt: new Date().toISOString(),
    };

    await appendProofRecord(proof);

    return proof;
  } catch (error) {
    throw translatePaymentError(error);
  }
}

function loadConfig() {
  const requiredKeys = [
    "CHAIN_RPC_URL",
    "GOAT_PAYER_PRIVATE_KEY",
    "GOAT_RECEIVER_ADDRESS",
    "CHAIN_EXPLORER_BASE",
  ];

  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new HelloGoatError(
      "MISSING_ENV",
      `Missing required environment variables: ${missing.join(", ")}`,
      hints.missingEnv,
    );
  }

  return {
    rpcUrl: process.env.CHAIN_RPC_URL!,
    privateKeyRaw: process.env.GOAT_PAYER_PRIVATE_KEY!,
    receiver: process.env.GOAT_RECEIVER_ADDRESS as Address,
    explorerBase: process.env.CHAIN_EXPLORER_BASE!.replace(/\/$/, ""),
  };
}
