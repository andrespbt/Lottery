const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { Lottery } = require('./compile');

const provider = new HDWalletProvider(
  'nest reform equip island inside other elbow absorb mandate select attitude trial',
  // remember to change this to your own phrase!
  'https://sepolia.infura.io/v3/c1a6a709e60046d69f63484e1bf38f79'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[1]);

  const result = await new web3.eth.Contract(Lottery.abi)
    .deploy({ data: Lottery.evm.bytecode.object })
    .send({ gas: '1000000', from: accounts[1] });
    
    console.log(JSON.stringify(Lottery.abi))

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
