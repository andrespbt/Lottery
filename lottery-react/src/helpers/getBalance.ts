import { ContractInfo } from "../interfaces/ContractInfo";
import lottery from "../lottery";
import web3 from "../web3";

export async function getBalance(setContractInfo:React.Dispatch<React.SetStateAction<ContractInfo>>) {
    const balance: string = await web3.eth.getBalance(lottery.options.address)
    setContractInfo(prevContractInfo => ({...prevContractInfo, balance}));
  }