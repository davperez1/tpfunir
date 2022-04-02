const { assert, AssertionError } = require('chai');

const CrowdFunding = artifacts.require ("CrowdFunding");

require('chai')
    .use(require('chai-as-promised'))
    .should();
const ERROR_MSG = 'VM Exception while processing transaction: revert';

describe("CrowdFunding contract", function () {
    let accounts;
    let _ownerAccount;
    let _secondAccount;
    let _thirdAccount;
    let crowdFunding;

    before (async function () {
        accounts = await web3.eth.getAccounts();
        _ownerAccount = accounts[0];
        _secondAccount = accounts[1];
        _thirdAccount = accounts[2];
        crowdFunding = await CrowdFunding.new();        
    });

    describe("Deploy CrowdFunding", function() {

        it('should deploy and sets an owner', async () => {                        
            assert.equal(await crowdFunding.owner.call(), _ownerAccount);
        });

        it('should create crowdfunding and return 0 token', async () => {            
            const result = await crowdFunding.getTotalGeneratedToken.call();
            
            assert.equal(+result.toString(), 0);
        });
    });

    describe("Set Name CrowdFunding", function() {
    
        it('should sets name of the CrowdFunding', async () => {                        
            const varName = "Este es un crowdfunding de prueba";            

            await crowdFunding.setNameCrowdFunding(varName);
            const result = await crowdFunding.getDataCrowdFunding.call()
            assert.equal(result[0], varName);            
        });

        it('It should not can set name in blank', async () => {                        
            await crowdFunding.setNameCrowdFunding("").should.be.rejectedWith(ERROR_MSG);            
        });

        it('Not owner, It should not can set name', async () => {                        
            await crowdFunding.setNameCrowdFunding("Nonmbre Valido pero no es owner", 
                {from: _secondAccount}).should.be.rejectedWith(ERROR_MSG);            
        });    
    });

    describe("Add token", function() {

        it('Not owner, It should not can add token', async () => {
            const newTokenForExchange = 20;
            const newTokenToTheWinner = 15;
    
            await crowdFunding.addToken(newTokenForExchange,
                newTokenToTheWinner, {from: _secondAccount}).should.be.rejectedWith(ERROR_MSG);
        });

        it('should add more token to the crowdfunding', async () => {
            const newTokenForExchange = 20;
            const newTokenToTheWinner = 15;
            const newTokenForExchange1 = 30;
            const newTokenToTheWinner1 = 5;
            
            const tokenInitialCero = await crowdFunding.getTotalGeneratedToken.call();
            await crowdFunding.addToken(newTokenForExchange, newTokenToTheWinner);        
            const result = await crowdFunding.getDataCrowdFunding.call();
            
            assert.equal(+result[4].toString(), 
                +tokenInitialCero.toString() + 
                newTokenToTheWinner + newTokenForExchange
            );
            assert.equal(+result[1],newTokenForExchange);
            assert.equal(+result[2],newTokenToTheWinner);

            await crowdFunding.addToken(newTokenForExchange1, newTokenToTheWinner1);        
            const result1 = await crowdFunding.getDataCrowdFunding.call();
            
            assert.equal(+result1[4].toString(), 
                +tokenInitialCero.toString() + 
                newTokenToTheWinner + newTokenForExchange +
                newTokenToTheWinner1 + newTokenForExchange1
            );    
            assert.equal(+result1[1], newTokenForExchange + newTokenForExchange1);
            assert.equal(+result1[2], newTokenToTheWinner + newTokenToTheWinner1);

        });       
        
        it('It should not can data entry invalid data', async () => {                                    
            await crowdFunding.addToken(0, 0)
                .should.be.rejectedWith(ERROR_MSG);
            await crowdFunding.addToken(0, 50)
                .should.be.rejectedWith(ERROR_MSG);
            await crowdFunding.addToken("dfe", 0)
                .should.be.rejected;
            await crowdFunding.addToken("dfe", "")
                .should.be.rejected;
        });
    });

    describe("Open CrowdFunding", function(){    
        it('should sets to open CrowdFunding', async () => {                        
            await crowdFunding.openCrowdFunding();
            const varState = await crowdFunding.getDataCrowdFunding();
            assert.equal(true, varState[3]);            
        });
        it('Not owner, It should not open CrowdFunding', async () => {    
            await crowdFunding.openCrowdFunding(
                {from: _secondAccount}).should.be.rejectedWith(ERROR_MSG);
        });
    });

    describe("Close CrowdFunding", function(){    
        it('should sets to close CrowdFunding', async () => {      
                await crowdFunding.closeCrowdFunding();
                const varState = await crowdFunding.getDataCrowdFunding();
            assert.equal(false, varState[3]);
        });

        it('Not owner, It should not close CrowdFunding', async () => {    
            await crowdFunding.closeCrowdFunding(
                {from: _secondAccount}).should.be.rejectedWith(ERROR_MSG);
        });
    });

    describe("Get Balance Token CFT", function(){
        it('Owner should get balance', async () => {      
            const varBalance = await crowdFunding.getBalanceCFT(_ownerAccount);
            var addTokenPreview = 70;
            assert.equal(addTokenPreview , +varBalance);
        });

        it('Second Account should get balance 0', async () => {      
            const varBalance = await crowdFunding.getBalanceCFT(_secondAccount);            
            assert.equal(0 , +varBalance);
        });
    });

    describe("Buy Token CFT with ETH", function(){
        it('transfer: should transfer 1 CFT to buyer and contract should have more ETH', async () => {            
            const priceTokenCFT = await crowdFunding.getPriceTokenCFT();
            var varBalanceReceiverCFT = await crowdFunding.getBalanceCFT(_secondAccount);
            var varBalanceReceiverETH = await web3.eth.getBalance(_secondAccount);
            var varBalanceContractETH = await web3.eth.getBalance(await crowdFunding.address);
            var varBalanceOwnerCFT = await crowdFunding.getBalanceCFT(_ownerAccount);
            var tokenToBuy = 1;
            var etherToPay = String(1);

            await crowdFunding.buyToken(_secondAccount, tokenToBuy,
                {from: _secondAccount, value: web3.utils.toWei( etherToPay, 'ether')});          

            var varBalanceReceiverAfterCFT = await crowdFunding.getBalanceCFT(_secondAccount);
            var varBalanceReceiverAfterETH = await web3.eth.getBalance(_secondAccount);
            var varBalanceContractAfterETH = await web3.eth.getBalance(await crowdFunding.address);
            var varBalanceOwnerAfterCFT = await crowdFunding.getBalanceCFT(_ownerAccount);

            assert.equal(+varBalanceReceiverAfterCFT , +varBalanceReceiverCFT + tokenToBuy);        
            assert.equal(+varBalanceReceiverAfterETH, varBalanceReceiverETH - (+priceTokenCFT));
            assert.equal(+varBalanceOwnerAfterCFT, +varBalanceOwnerCFT - tokenToBuy);
            assert.equal(+varBalanceContractAfterETH, +varBalanceContractETH + (+priceTokenCFT));
        });

        it('transfer: should transfer 2 or more CFT to buyer and contract should have more ETH', async () => {            
            const priceTokenCFT = await crowdFunding.getPriceTokenCFT();
            var varBalanceReceiverCFT = await crowdFunding.getBalanceCFT(_secondAccount);
            var varBalanceReceiverETH = await web3.eth.getBalance(_secondAccount);
            var varBalanceContractETH = await web3.eth.getBalance(await crowdFunding.address);
            var varBalanceOwnerCFT = await crowdFunding.getBalanceCFT(_ownerAccount);
            var tokenToBuy = 3;
            var etherToPay = String(3);

            await crowdFunding.buyToken(_secondAccount, tokenToBuy,
                {from: _secondAccount, value: web3.utils.toWei( etherToPay, 'ether')});            

            var varBalanceReceiverAfterCFT = await crowdFunding.getBalanceCFT(_secondAccount);
            var varBalanceReceiverAfterETH = await web3.eth.getBalance(_secondAccount);
            var varBalanceContractAfterETH = await web3.eth.getBalance(await crowdFunding.address);
            var varBalanceOwnerAfterCFT = await crowdFunding.getBalanceCFT(_ownerAccount);

            assert.equal(+varBalanceReceiverAfterCFT , +varBalanceReceiverCFT + tokenToBuy);        
            assert.equal(+varBalanceReceiverAfterETH, varBalanceReceiverETH - (+priceTokenCFT * 3));
            assert.equal(+varBalanceOwnerAfterCFT, +varBalanceOwnerCFT - tokenToBuy);
            assert.equal(+varBalanceContractAfterETH, +varBalanceContractETH + (+priceTokenCFT * 3));
        });


        it('transfer: when pay eth > to CFT cost should return extra eth to the buyer', async () => {
            const priceTokenCFT = await crowdFunding.getPriceTokenCFT();
            var varBalanceReceiverETH = await web3.eth.getBalance(_secondAccount);
            var tokenToBuy = 1;
            var etherToPay = String(3);
            
            await crowdFunding.buyToken(_secondAccount, tokenToBuy,
                {from: _secondAccount, value: web3.utils.toWei( etherToPay, 'ether')});
                
            var varBalanceReceiverAfterETH = await web3.eth.getBalance(_secondAccount);
            
            assert.equal(+varBalanceReceiverAfterETH, varBalanceReceiverETH - (+priceTokenCFT));

        });

        it('transfer: when pay eth < to CFT cost should be fail', async () => {            
                var tokenToBuy = 1;
                var etherToPay = String(0.5);
                
                await crowdFunding.buyToken(_secondAccount, tokenToBuy, 
                    {
                        from: _secondAccount, 
                        value: web3.utils.toWei( etherToPay, 'ether')
                    }).should.be.rejectedWith(ERROR_MSG);

        });
        it('transfer: when CFT=0  should be fail', async () => {
        // Ver como usuar fake Contract
        });

    });

    describe("Return ETH for Token CFT", function(){
        it('transfer: should return eth to the buyer and contract should have less ETH', async () => {

        });

        it('transfer: when return eth < to CFT cost should be fail', async () => {

        });
    });

    describe("Buy Ticket to the lottery CrowdFunding", function(){
        
        it('should not buy ticket when CrowdFunding close state', async () => {
            await crowdFunding.buyTicketLottery(
                { from: _secondAccount }).should.be.rejectedWith(ERROR_MSG);
        });

        it('should not buy ticket when balanceCFT < price Ticket lotter', async () => {
            await crowdFunding.openCrowdFunding();
            var balanceCFTBeforeBuyTicket = await crowdFunding.getBalanceCFT(_thirdAccount);
            
            assert.equal(0, +balanceCFTBeforeBuyTicket);

            await crowdFunding.buyTicketLottery({ from: _thirdAccount })
                .should.be.rejectedWith(ERROR_MSG);            
        });

        it('should buy one ticket lottery and Contract should be have more Token CFT', async () => {
            await crowdFunding.openCrowdFunding();
            const balanceCFTAccountBeforeBuyTicket = await crowdFunding.getBalanceCFT(_secondAccount);
            const cantTotalTicketBeforeBuyLTicketotterySold = await crowdFunding.getCantTicketTotalLottery();
            const balanceContractBeforeCFT = await crowdFunding.getBalanceCFT(await crowdFunding.address); 
            const twoTokenToBuy = 2;
            const etherToPay = String(2) ;
            const cantTicketLotteryBuy = 1;

            await crowdFunding.buyToken(_secondAccount, twoTokenToBuy,
                {from: _secondAccount, value: web3.utils.toWei( etherToPay, 'ether')});
            await crowdFunding.buyTicketLottery({ from: _secondAccount });

            const balanceCFTAccountAfterBuyTicket = await crowdFunding.getBalanceCFT(_secondAccount);
            const cantTotalTicketAfterBuyLTicketotterySold = await crowdFunding.getCantTicketTotalLottery();
            const balanceContractAfterCFT = await crowdFunding.getBalanceCFT(await crowdFunding.address); 

            assert.equal(+cantTotalTicketAfterBuyLTicketotterySold, 
                +cantTotalTicketBeforeBuyLTicketotterySold + cantTicketLotteryBuy);
            assert.equal(+balanceCFTAccountAfterBuyTicket, +balanceCFTAccountBeforeBuyTicket);
            assert.equal(+balanceContractAfterCFT, +balanceContractBeforeCFT + twoTokenToBuy);
        });

        it('Should buy one ticket lottery', async () => {            
            // await crowdFunding.openCrowdFunding();      
            // const cantTotalTicketBeforeBuyLTicketotterySold = await crowdFunding.getCantTicketTotalLottery();
            // const cantBuyTicketLotteryInThisTest = 2;
            // await crowdFunding.buyTicketLottery({ from: _secondAccount });
            // await crowdFunding.buyTicketLottery({ from: _thirdAccount });

            // const cantTotalTicketAfterBuyTicketLotterySold = await crowdFunding.getCantTicketTotalLottery();
            // assert.equal(+cantTotalTicketAfterBuyTicketLotterySold , cantTotalTicketBeforeBuyLTicketotterySold +
            //     cantBuyTicketLotteryInThisTest );

            // const varGetNumerTicketLotteryAssigned = await crowdFunding.getAllNumberTicketLotteryPerson(_secondAccount);
            // assert.equal(1 , +varGetNumerTicketLotteryAssigned[0]);

            // const varGetAddressFromNumberAssigned = await crowdFunding.getAddressFromNumberLotteryAssigned(1);
            // assert.equal(_secondAccount , varGetAddressFromNumberAssigned);
        });

        // it('Should buy two ticket lottery', async () => {
        //     await crowdFunding.openCrowdFunding();                  
        //     await crowdFunding.buyTicketLottery(_thirdAccount);

        //     const varGetNumerTicketLotteryAssigned = await crowdFunding.getAllNumberTicketLotteryPerson(_secondAccount);
        //     assert.equal(1 , varGetNumerTicketLotteryAssigned.length);
        
        //     const varGetNumerTicketLotteryAssigned1 = await crowdFunding.getAllNumberTicketLotteryPerson(_thirdAccount);
        //     assert.equal(2 , varGetNumerTicketLotteryAssigned1.length);
            
        // });
    });

    //agregar mas compradores
    //sortear
    //verificar que sea el que ha comprado

    //TODO: BURN TOKEN
});