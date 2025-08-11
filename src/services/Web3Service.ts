import { ethers, JsonRpcSigner, Contract, BrowserProvider, TransactionResponse } from "ethers";
import LinkShieldABI from "../abis/LinkShield.json"; 

const CONTRACT_ABI = LinkShieldABI as ethers.InterfaceAbi;
const CONTRACT_ADDRESS = "0x345ccd93d0526017b2b6441dd86266014e3eb71f";

let provider: BrowserProvider | undefined;
let signer: JsonRpcSigner | undefined;
let contract: Contract | undefined;

// Função para se conectar à carteira e inicializar o contrato
export async function connectWallet(): Promise<boolean> {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask não encontrado. Instale a extensão para continuar.");
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Carteira conectada e contrato inicializado!");
    return true;
  } catch (error: unknown) {
    console.error("Erro ao conectar à carteira:", error);
    throw new Error("Não foi possível conectar à carteira. ");
  }
}

// Função para adicionar um novo link (addLink)
export async function addLink(url: string, linkId: string, fee: string): Promise<TransactionResponse> {
  if (!contract) {
    await connectWallet();
  }
  
  if (!contract) {
      throw new Error("Contrato não foi inicializado.");
  }
  
  try {
    const feeInWei = ethers.parseUnits(fee, "wei");
    const tx = await contract.addLink(url, linkId, feeInWei);
    await tx.wait(); // Espera a transação ser minerada
    return tx;
  } catch (error: unknown) {
    console.error("Erro ao adicionar o link:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    throw new Error(`Erro ao adicionar o link: ${errorMessage}`);
  }
}

// Função para pagar pelo acesso ao link (payLink)
export async function payLink(linkId: string, fee: string): Promise<TransactionResponse> {
  if (!contract) {
    await connectWallet();
  }

  if (!contract) {
      throw new Error("Contrato não foi inicializado.");
  }

  try {
    const feeInWei = ethers.parseUnits(fee, "wei");
    const tx = await contract.payLink(linkId, { value: feeInWei });
    await tx.wait();
    return tx;
  } catch (error: unknown) {
    console.error("Erro ao pagar pelo link:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    throw new Error(`Erro ao pagar pelo link: ${errorMessage}`);
  }
}

interface LinkData {
    url: string;
    owner: string;
    fee: string;
}

// Função para obter os dados de um link (getLink)
export async function getLink(linkId: string): Promise<LinkData> {
  if (!contract) {
    await connectWallet();
  }

  if (!contract) {
      throw new Error("Contrato não foi inicializado.");
  }

  try {
    const link = await contract.getLink(linkId);
    return {
      url: link.url,
      owner: link.owner,
      fee: ethers.formatUnits(link.fee.toString(), "wei")
    };
  } catch (error: unknown) {
    console.error("Erro ao buscar o link:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    throw new Error(`Erro ao buscar pelo link: ${errorMessage}`);
  }
}

// Função para obter o status de acesso (hasAccess)
export async function hasAccess(linkId: string, userAddress: string): Promise<boolean> {
  if (!contract) {
    await connectWallet();
  }
  
  if (!contract) {
      throw new Error("Contrato não foi inicializado.");
  }
  
  try {
    return await contract.hasAccess(linkId, userAddress);
  } catch (error: unknown) {
    console.error("Erro ao verificar o acesso:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    throw new Error(`Erro ao verificar o acesso: ${errorMessage}`);
  }
}