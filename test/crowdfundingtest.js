const { assert } = require('chai');

const CrowdFunding = artifacts.require ("CrowdFunding");

require('chai')
    .use(require('chai-as-promised'))
    .should();
const ERROR_MSG = 'VM Exception while processing transaction: revert';

describe("CrowdFunding contract", function () {
    let accounts;
    let _ownerAccount;
    let _secondAccount;
    let crowdFunding;

    before (async function () {
        accounts = await web3.eth.getAccounts();
        _ownerAccount = accounts[0];
        _secondAccount = accounts[1];
        crowdFunding = await CrowdFunding.new();
    });

    describe("Deploy CrowdFunding", function() {

        it('should deploy and sets an owner', async () => {                        
            assert.equal(await crowdFunding.owner.call(), _ownerAccount);
        });

        it('should create crowdfunding and return 0 token', async () => {            
            const result = await crowdFunding.totalToken.call();
            
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
            
            const tokenInitialCero = await crowdFunding.totalToken.call();
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

    //TODO: BURN TOKEN
});