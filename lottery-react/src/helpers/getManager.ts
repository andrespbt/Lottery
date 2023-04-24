import { ContractInfo } from '../interfaces/ContractInfo';
import lottery from '../lottery';


export async function getManager(setContractInfo:React.Dispatch<React.SetStateAction<ContractInfo>>) {
  const manager: string = await lottery.methods.manager().call();
  setContractInfo(prevContractInfo => ({...prevContractInfo, manager}));
}
