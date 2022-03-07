const CrowdFunding = artifacts.require ("CrowdFunding");

contract('CrowdFunding', (accounts) => {
    const [firstAccount] = accounts;

    it('sets an owner', async () => {
        const crowdFunding = await CrowdFunding.new();
        
        assert.equal(await crowdFunding.owner.call(), firstAccount);
    });
  
});