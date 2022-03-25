// SPDX-License-Identifier: MIT

import "./CrowdFundingTOKEN.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

contract CrowdFunding is Ownable {
    CrowdFundingTOKEN token;
    string name;
    uint256 cantTokenForExchange;
    uint256 cantTokenToTheWinner;
    bool stateCanFund;
    using Counters for Counters.Counter;
    Counters.Counter private _numberTicket;
    mapping (address => uint256 []) personAddress_NumberTicketMap;
    mapping (uint256 => address) numberTicketAssigned_personAddressMap;

    struct WinnerLottery{
        address accountWinner;
        uint256 numerWinner; 
    }
    WinnerLottery winnerLottery;
    
    constructor() {
        token = new CrowdFundingTOKEN();
        name = "";
        stateCanFund = false;
    }

    function setNameCrowdFunding(string memory _name) public onlyOwner {
        // Verifica que el Nombre no sea nulo
        require(bytes(_name).length > 0);        
        name = _name;        
    }

    function getDataCrowdFunding() public view returns (string memory, uint256,uint256, bool, uint256) {        
        return (name, cantTokenForExchange, cantTokenToTheWinner, stateCanFund, token.totalSupply());
    }

    function totalToken() public view returns (uint256) {
        return token.totalSupply();
    }

    function addToken(uint256 _cantTokenForExchange, 
        uint256 _cantTokenToTheWinner) public onlyOwner {

        // Verifica valores validos
        require(_cantTokenForExchange > 0);
        require(_cantTokenToTheWinner >= 0);

        token.mint(
                msg.sender, 
                _cantTokenForExchange + 
                _cantTokenToTheWinner)
        ;
        cantTokenForExchange = cantTokenForExchange + _cantTokenForExchange;
        cantTokenToTheWinner = cantTokenToTheWinner + _cantTokenToTheWinner;
    }

    function openCrowdFunding() public onlyOwner {
        stateCanFund = true;
    }

    function closeCrowdFunding() public  onlyOwner {
        stateCanFund = false;
    }

    function getBalance(address account) view public returns (uint256){
        return token.balanceOf(account);
    }

    // function buyToken(uint cantToken, address a) public payable {
    //     token.transferFrom(address(this), a, cantToken);        
    // }

    // function buyToken1(address to, uint cantToken) public payable {
    //     token.approve(msg.sender, cantToken);
    //     //token.transfer(to, cantToken);
    //     //token.transferFrom(owner(), msg.sender, cantToken);
    // }

    
    // function buyToken2() view public returns(address) {
    //     return msg.sender;        
    // }

    function buyTicketLottery(address account) public {
        // controlar que tenga token para comprar un ticket
        // actualizar token juntado por venta        
        require(stateCanFund == true);        
        
        _numberTicket.increment();
        personAddress_NumberTicketMap[account].push(_numberTicket.current());
        numberTicketAssigned_personAddressMap[_numberTicket.current()] = account;
    }

    function getCantTicketTotalLottery() view public returns(uint256) {        
        return _numberTicket.current();
    }

    function getAllNumberTicketLotteryPerson(address account) view public returns(uint256 [] memory) {
        return personAddress_NumberTicketMap[account];
    }
    
    function getAddressFromNumberLotteryAssigned(
        uint256 _number) view public returns(address) {
        return numberTicketAssigned_personAddressMap[_number];
    }

    function closeCrowdFundingAndPickTheWinner() public onlyOwner{
    //verificar que esté abierto el crowdfundiong
    //verificar que haya número vendidos
    //generar el random con el número máximo de venta
    //devolver tokenes a todos los participantes
    //darle al ganador el premio
    require(_numberTicket.current()>0);
    uint numberWinner = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % _numberTicket.current());

    winnerLottery.accountWinner = getAddressFromNumberLotteryAssigned(numberWinner);
    winnerLottery.numerWinner = numberWinner;

    }
}