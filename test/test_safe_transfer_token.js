const TestToken = artifacts.require('./TestToken.sol')
contract('TestSafeTransferToken', (accounts) => {
  it("should assert true", async () => {
    const ins = await TestToken.new()
    assert.isOk(ins)
  })
  describe("transfer test", () => {
    it("owner balance is 10000 * 10^18.", async () => {
      const ins = await TestToken.new()
      const balanceOfOwner = await ins.balanceOf(accounts[0])
      assert.equal(10000 * 10 ** 18, balanceOfOwner.toNumber())
    })
    describe("#1 owner balance is down after transfer.", () => {
      let ins, owner, receiver;
      before(async () => {
        owner = accounts[0]
        receiver = accounts[1]
        ins = await TestToken.new()
        await ins.transfer(receiver, 100 * 10 ** 18)
      })
      it("#1-1 balance change to 9900.", async () => {
        const balanceOfOwner = await ins.balanceOf(owner)
        assert.equal(9900 * 10 ** 18, balanceOfOwner.toNumber())
      })
      it("#1-2 receiver receivable balance is grow 100.", async () => {
        const balanceOfReceiver = await ins.receivableBalancesOf(receiver)
        assert.equal(100 * 10 ** 18, balanceOfReceiver.toNumber())
      })
      it("#1-3 receiver balanceOf is zero.", async () => {
        const balanceOfReceiver = await ins.balanceOf(receiver)
        assert.equal(0, balanceOfReceiver.toNumber())
      })
    })

    describe("#2 transfer then receiv and cancel test.", () => {
      let ins, owner, receiver;
      beforeEach(async () => {
        owner = accounts[0]
        receiver = accounts[1]
        ins = await TestToken.new()
        await ins.transfer(receiver, 100 * 10 ** 18)
      })
      describe("#2-1 cancel transfer.", async () => {
        it("#2-1-1 owner balances is recover after canceled.", async () => {
          await ins.cancelTransfer(receiver)
          const balanceOfOwner = await ins.balanceOf(owner)
          assert.equal(10000 * 10 ** 18, balanceOfOwner.toNumber())
        })
        it("#2-1-2 receive deposites.", async () => {
          await ins.receiveFrom(owner, {from: receiver})
          const balanceOfOwner = await ins.balanceOf(owner)
          const balanceOfReceiver = await ins.balanceOf(receiver)
          const receivableBalances = await ins.receivableBalancesOf(receiver)

          assert.equal(9900 * 10 ** 18, balanceOfOwner.toNumber())
          assert.equal(100 * 10 ** 18, balanceOfReceiver.toNumber())
          assert.equal(0, receivableBalances.toNumber())
        })
      })
    })
  })
})
