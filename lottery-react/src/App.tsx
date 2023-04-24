import './App.css';
import { useEffect, useState } from 'react';
import { getManager } from './helpers/getManager';
import { getPlayers } from './helpers/getPlayers';
import { ContractInfo } from './interfaces/ContractInfo';
import { getBalance } from './helpers/getBalance';
import web3 from './web3';
import lottery from './lottery';

const initialState = {
  manager: '',
  players: [],
  balance: '',
  value: '',
  enterLotteryMsg: '',
  pickWinnerMsg: '',
};

function App() {
  const [contractInfo, setContractInfo] = useState<ContractInfo>(initialState);

  useEffect(() => {
    getManager(setContractInfo);
    getPlayers(setContractInfo);
    getBalance(setContractInfo);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [walletAddress] = await web3.eth.requestAccounts();

    try {
      setContractInfo({ ...contractInfo, enterLotteryMsg: 'Waiting on transaction success...' });

      await lottery.methods.enter().send({
        from: walletAddress,
        value: web3.utils.toWei(contractInfo.value, 'ether'),
        gas: '300000',
      });

      getPlayers(setContractInfo);
      getBalance(setContractInfo);

      setContractInfo({ ...contractInfo, enterLotteryMsg: 'Congrats! You have entered the lottery!' });
    } catch (error) {
      setContractInfo({ ...contractInfo, enterLotteryMsg: 'Transaction failed' });
      console.log(error);
    } finally {
      setTimeout(() => {
        setContractInfo({ ...contractInfo, enterLotteryMsg: '' });
      }, 8000);
    }
  };

  const onPickWinnerClick = async () => {
    const [walletAddress] = await web3.eth.requestAccounts();

    try {
      setContractInfo({ ...contractInfo, pickWinnerMsg: 'Picking winner...' });

    await lottery.methods.pickWinner().send({
      from: walletAddress,
      gas: '300000',
    });
    
    const winner = await lottery.methods.lastwinner().call();

      setContractInfo({ ...contractInfo, pickWinnerMsg: `The winner is ${winner} !`, enterLotteryMsg:'' });
      
      await getPlayers(setContractInfo);
      await getBalance(setContractInfo);
    } catch (error) {
      setContractInfo({ ...contractInfo, pickWinnerMsg: 'Transaction failed', enterLotteryMsg: '' });
      console.log(error);
    } finally {
      setTimeout(() => {
        setContractInfo({ ...contractInfo, pickWinnerMsg: '', enterLotteryMsg: '' });
      }, 8000);
    }
  };

  return (
    <>
      {contractInfo.manager && (
        <div>
          <h2>This is our Lottery Contract</h2>
          <p>This contract is managed by {contractInfo.manager}</p>
          <p>
            There are currently {contractInfo.players.length} people competing to win{' '}
            {web3.utils.fromWei(contractInfo.balance, 'ether')} ether!
          </p>
          <hr />
          <form onSubmit={onSubmit}>
            <h4>Want to try your luck ?</h4>
            <div>
              <label htmlFor="">Amount of ether to enter</label>
              <input
                value={contractInfo.value}
                type="text"
                onChange={e => setContractInfo({ ...contractInfo, value: e.target.value })}
              />
            </div>
            <button>Enter</button>
          </form>
          {contractInfo.enterLotteryMsg && <h1>{contractInfo.enterLotteryMsg}</h1>}
          <hr />
          <h4>Ready to pick a winner ?</h4>
          <button onClick={onPickWinnerClick}>Pick a winner !</button>
          {contractInfo.pickWinnerMsg && <h1>{contractInfo.pickWinnerMsg}</h1>}
          <hr />
        </div>
      )}
    </>
  );
}

export default App;
