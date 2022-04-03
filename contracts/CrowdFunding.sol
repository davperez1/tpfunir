// SPDX-License-Identifier: MIT

import "./CrowdFundingTOKEN.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

contract CrowdFunding is Ownable {
    CrowdFundingTOKEN private _token;
    string private _name;
    uint256 private _cantTokenForExchange;
    uint256 private _cantTokenToTheWinner;
    bool private _stateCanFund;
    uint256 private _priceTokenCFT;
    uint256 private _priceTicketLottery;
    using Counters for Counters.Counter;
    Counters.Counter private _numberTicket;
    mapping (address => uint256 []) _Address_ListNumberTicketMap;
    mapping (uint256 => address) _numberTicketAssigned_AddressMap;

    struct WinnerLotteryStruct{
        address accountWinner;
        uint256 numberWinner; 
    }
    WinnerLotteryStruct private _winnerLotteryStruct;

    event LogBuyToken(uint indexed date, address indexed _buyer, uint cantToken);
    event LogBuyTicket(uint indexed date,address indexed from, uint256 priceTicket);    
    event LogMakeLottery(uint indexed date, address indexed accountWinner, uint numberWinner);
    event LogAddToken(uint indexed date, uint256 cantAddTokenForExchange, 
        uint256 cantAddTokenToTheWinner);
    
    constructor() {
        _token = new CrowdFundingTOKEN();
        _name = "";
        _stateCanFund = false;
        _token.approve(address(this), 0);
        _priceTokenCFT = 1 ether;
        _priceTicketLottery = 2;
    }

    function setNameCrowdFunding(string memory name) public onlyOwner {
        // Verifica que el Nombre no sea nulo
        require(bytes(name).length > 0);        
        _name = name;        
    }

    function getDataCrowdFunding() external view returns (string memory, uint256,uint256, bool, uint256) {        
        return (_name, _cantTokenForExchange, _cantTokenToTheWinner, _stateCanFund, _token.totalSupply());
    }

    function getPriceTokenCFT() external view returns(uint256) {
        return _priceTokenCFT;
    }

    function getPriceTicketLottery() external view returns(uint256) {
        return _priceTicketLottery;
    }

    function getTotalGeneratedToken() external view returns (uint256) {
        return _token.totalSupply();
    }

    function addToken(uint256 cantAddTokenForExchange, 
        uint256 cantAddTokenToTheWinner) external onlyOwner {

        require(cantAddTokenForExchange > 0);
        require(cantAddTokenToTheWinner >= 0);

        _token.mint(
                msg.sender, 
                cantAddTokenForExchange + 
                cantAddTokenToTheWinner)
        ;
        _cantTokenForExchange = _cantTokenForExchange + cantAddTokenForExchange;
        _cantTokenToTheWinner = _cantTokenToTheWinner + cantAddTokenToTheWinner;
        _token.increaseAllowance(address(this), _cantTokenForExchange);
        
        emit LogAddToken(block.timestamp, cantAddTokenForExchange, cantAddTokenToTheWinner);

    }

    function openCrowdFunding() external onlyOwner {
        _stateCanFund = true;
    }

    function closeCrowdFunding() external  onlyOwner {
        _stateCanFund = false;
    }

    function getBalanceCFT(address account) view external returns (uint256){
        return _token.balanceOf(account);
    }

    function getBalanceCrowdFundingETH() view external returns(uint256){
        return (address(this).balance);
    }

    function buyToken(address payable _buyer, uint cantToken) external payable {
        uint totalPriceToken = _priceTokenCFT * cantToken;
        require(msg.value >= totalPriceToken);
        require(_cantTokenForExchange > 0);        

        uint returnValue = msg.value - totalPriceToken;
        if (returnValue > 0){
            _buyer.transfer(returnValue);
        }                    

        _token.transferCFT(owner(), msg.sender, cantToken);
        _cantTokenForExchange -= cantToken;

        emit LogBuyToken(block.timestamp, _buyer, cantToken);
    }

    function buyTicketLottery() external {                
        require(_stateCanFund == true);
        require(this.getBalanceCFT(msg.sender) >= this.getPriceTicketLottery());

        _numberTicket.increment();
        _Address_ListNumberTicketMap[msg.sender].push(_numberTicket.current());
        _numberTicketAssigned_AddressMap[_numberTicket.current()] = msg.sender;

        _token.transferCFT(msg.sender, address(this), this.getPriceTicketLottery());

        emit LogBuyTicket(block.timestamp, msg.sender, this.getPriceTicketLottery());

    }

    function getCantTicketTotalLottery() view external returns(uint256) {        
        return _numberTicket.current();
    }

    function getCantTicketLotteryFromAccount(address account) view external returns(uint256) {
        return _Address_ListNumberTicketMap[account].length;
    }
    
    function getAddressFromNumberLotteryAssigned(
        uint256 _number) view public returns(address) {
        return _numberTicketAssigned_AddressMap[_number];
    }

    function getListNumberTicketAssigned(address account) view external returns(uint256 [] memory) {
        return _Address_ListNumberTicketMap[account];
    }

    function makeLottery() external onlyOwner{
    //verificar que esté cerrado el crowdfundiong
    //verificar que haya número vendidos
    //generar el random con el número máximo de venta
    //devolver tokenes a todos los participantes
    //darle al ganador el premio
    require(_numberTicket.current()>0);
    uint numberWinner = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % _numberTicket.current());

    _winnerLotteryStruct.accountWinner = getAddressFromNumberLotteryAssigned(numberWinner);
    _winnerLotteryStruct.numberWinner = numberWinner;

    emit LogMakeLottery(block.timestamp, _winnerLotteryStruct.accountWinner,
        _winnerLotteryStruct.numberWinner);
    }

    function getWinnerLottery() external view returns(WinnerLotteryStruct memory) {
        return _winnerLotteryStruct;
    }
}