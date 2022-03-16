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

    describe("Create CrowdFunding", function() {
    
        it('should sets a name to CrowdFunding', async () => {                        
            const varName = "Este es un crowdfunding de prueba";

            await crowdFunding.setDataCrowdFunding(varName);
            const result = await crowdFunding.getDataCrowdFunding.call()
            assert.equal(result[0], varName);
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
            const result = await crowdFunding.totalToken.call();
            
            assert.equal(+result.toString(), 
                +tokenInitialCero.toString() + 
                newTokenToTheWinner +newTokenForExchange
            );    

            await crowdFunding.addToken(newTokenForExchange1, newTokenToTheWinner1);        
            const result1 = await crowdFunding.totalToken.call();
            
            assert.equal(+result1.toString(), 
                +tokenInitialCero.toString() + 
                newTokenToTheWinner + newTokenForExchange +
                newTokenToTheWinner1 + newTokenForExchange1
            );    
        });            
    });
});