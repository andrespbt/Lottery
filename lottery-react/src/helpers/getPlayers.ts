import { ContractInfo } from '../interfaces/ContractInfo';
import lottery from '../lottery';


export async function getPlayers(setContractInfo:React.Dispatch<React.SetStateAction<ContractInfo>>) {
  const players = await lottery.methods.getPlayers().call();
  
  setContractInfo(prevContractInfo => ({...prevContractInfo, players}));
}