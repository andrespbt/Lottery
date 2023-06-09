// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

contract Lottery {

    address public manager;
    address payable[] public players;
    address public lastwinner;

    constructor() {
        manager = payable(msg.sender);
    }

    modifier restricted() {
        require(msg.sender == manager, "Sender is not the manager");
        _;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "Minimun amount to enter the lottery is 0.11 eth");
        players.push(payable(msg.sender));
    }

    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        lastwinner = players[index];
        players = new address payable[](0);
        
        
    }

    function getPlayers() public view returns(address payable[] memory){
        return players;
    }




}