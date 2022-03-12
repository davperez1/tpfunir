const CrowdFunding = artifacts.require ("CrowdFunding");

require('chai')
    .use(require('chai-as-promised'))
    .should();
const ERROR_MSG = 'VM Exception while processing transaction: revert';


contract('CrowdFunding', (accounts) => {
    const [firstAccount] = accounts;
    const secondAccount = accounts[1];

    it('sets an owner', async () => {
        const crowdFunding = await CrowdFunding.new();
        
        assert.equal(await crowdFunding.owner.call(), firstAccount);
    });

    it('create crowdfunding and return 0 token por default', async () => {
        const crowdFunding = await CrowdFunding.new();
        
        const expected = await crowdFunding.totalToken.call();
        
        assert.equal(+expected.toString(), 0);
    });
    
    it('Add more token to the crowdfunding', async () => {
        const crowdFunding = await CrowdFunding.new();
        const newCantToken = 15;
        const newCantToken1 = 3;
        
        const tempVar = await crowdFunding.totalToken.call();
        await crowdFunding.addToken(newCantToken);        
        const expected = await crowdFunding.totalToken.call();
        
        assert.equal(+expected.toString(), +tempVar.toString() + newCantToken);

        await crowdFunding.addToken(newCantToken1);        
        const expected1 = await crowdFunding.totalToken.call();

        assert.equal(+expected1.toString(), +tempVar.toString() + newCantToken + newCantToken1);

    });
    
    it('Not owner, It should not can add token', async () => {
        const crowdFunding = await CrowdFunding.new();
        const newCantToken = 15;

        await crowdFunding.addToken(newCantToken,{from: secondAccount})
            .should.be.rejectedWith(ERROR_MSG);
    });
});