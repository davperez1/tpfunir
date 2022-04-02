// SPDX-License-Identifier: MIT

import "./CrowdFundingTOKEN.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

contract CrowdFunding is Ownable {
    CrowdFundingTOKEN private token;
    string private name;
    uint256 private cantTokenForExchange;
    uint256 private cantTokenToTheWinner;
    bool private stateCanFund;
    uint256 private priceTokenCFT;
    uint256 private priceTicketLottery;
    using Counters for Counters.Counter;
    Counters.Counter private _numberTicket;
    mapping (address => uint256 []) personAddress_NumberTicketMap;
    mapping (uint256 => address) numberTicketAssigned_personAddressMap;

    struct WinnerLottery{
        address accountWinner;
        uint256 numerWinner; 
    }
    WinnerLottery private winnerLottery;
    
    constructor() {
        token = new CrowdFundingTOKEN();
        name = "";
        stateCanFund = false;
        token.approve(address(this), 0);
        priceTokenCFT = 1 ether;
        priceTicketLottery = 2;
    }

    function setNameCrowdFunding(string memory _name) public onlyOwner {
        // Verifica que el Nombre no sea nulo
        require(bytes(_name).length > 0);        
        name = _name;        
    }

    function getDataCrowdFunding() public view returns (string memory, uint256,uint256, bool, uint256) {        
        return (name, cantTokenForExchange, cantTokenToTheWinner, stateCanFund, token.totalSupply());
    }

    function getPriceTokenCFT() public view returns(uint256) {
        return priceTokenCFT;
    }

    function getPriceTicketLottery() public view returns(uint256) {
        return priceTicketLottery;
    }

    function getTotalGeneratedToken() public view returns (uint256) {
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
        token.increaseAllowance(address(this), cantTokenForExchange);
    }

    function openCrowdFunding() public onlyOwner {
        stateCanFund = true;
    }

    function closeCrowdFunding() public  onlyOwner {
        stateCanFund = false;
    }

    function getBalanceCFT(address account) view public returns (uint256){
        return token.balanceOf(account);
    }

    function getBalanceCrowdFundingETH() view public returns(uint256){
        return (address(this).balance);
    }

    function buyToken(address payable _buyer, uint cantToken) public payable {
        uint totalPriceToken = priceTokenCFT * cantToken;
        require(msg.value >= totalPriceToken);
        require(cantTokenForExchange > 0);        

        uint returnValue = msg.value - totalPriceToken;
        if (returnValue > 0){
            _buyer.transfer(returnValue);
        }                    

        token.transferCFT(owner(), msg.sender, cantToken);
        cantTokenForExchange -= cantToken;
    }

    function buyTicketLottery() public {                
        require(stateCanFund == true);
        require(this.getBalanceCFT(msg.sender) >= this.getPriceTicketLottery());

        _numberTicket.increment();
        personAddress_NumberTicketMap[msg.sender].push(_numberTicket.current());
        numberTicketAssigned_personAddressMap[_numberTicket.current()] = msg.sender;

        token.transferCFT(msg.sender, address(this), this.getPriceTicketLottery());

    }

    function getCantTicketTotalLottery() view public returns(uint256) {        
        return _numberTicket.current();
    }

    function getCantTicketLotteryFromAccount(address account) view public returns(uint256) {
        return personAddress_NumberTicketMap[account].length;
    }
    
    function getAddressFromNumberLotteryAssigned(
        uint256 _number) view public returns(address) {
        return numberTicketAssigned_personAddressMap[_number];
    }

    function getListNumberTicketAssigned(address account) view public returns(uint256 [] memory) {
        return personAddress_NumberTicketMap[account];
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