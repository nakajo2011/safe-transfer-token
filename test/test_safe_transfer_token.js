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
      before(async () => {
        owner = accounts[0]
        receiver = accounts[1]
      })
      describe("#2-1 cancel transfer.", async () => {
        before(async () => {
          ins = await TestToken.new()
          await ins.transfer(receiver, 100 * 10 ** 18)
          await ins.cancelTransfer(receiver)
        })
        it("#2-1-1 owner balances is recover.", async () => {
          const balanceOfOwner = await ins.balanceOf(owner)
          assert.equal(10000 * 10 ** 18, balanceOfOwner.toNumber())
        })
        it("#2-1-2 receiver receivableBalances is zero.", async () => {
          const balances = await ins.receivableBalancesOf(receiver)
          assert.equal(0, balances.toNumber())
        })
      })
      describe("#2-2 receive deposit.", async () => {
        before(async () => {
          ins = await TestToken.new()
          await ins.transfer(receiver, 100 * 10 ** 18)
          await ins.receiveFrom(owner, {from: receiver})
        })
        it("#2-2-1 owner balances is down.", async () => {
          const balanceOfOwner = await ins.balanceOf(owner)
          assert.equal(9900 * 10 ** 18, balanceOfOwner.toNumber())
        })
        it("#2-2-2 receiver balance add 100.", async () => {
          const balances = await ins.balanceOf(receiver)
          assert.equal(100 * 10 ** 18, balances.toNumber())
        })
        it("#2-2-3 receiveable is zero.", async () => {
          const receivableBalances = await ins.receivableBalancesOf(receiver)
          assert.equal(0, receivableBalances.toNumber())
        })
      })
    })

    describe("#3 second transfer to same receiver is increased balances.", () => {
      let ins, owner, receiver;
      before(async () => {
        owner = accounts[0]
        receiver = accounts[1]
        ins = await TestToken.new()
        await ins.transfer(receiver, 100 * 10 ** 18)
        await ins.transfer(receiver, 100 * 10 ** 18)
      })

      it("#3-1 balance change to 9800.", async () => {
        const balanceOfOwner = await ins.balanceOf(owner)
        assert.equal(9800 * 10 ** 18, balanceOfOwner.toNumber())
      })
      it("#3-2 receiver receivable balance is grow 200.", async () => {
        const balanceOfReceiver = await ins.receivableBalancesOf(receiver)
        assert.equal(200 * 10 ** 18, balanceOfReceiver.toNumber())
      })
      it("#3-3 receiver balances is 200 after receiveFrom", async () => {
        await ins.receiveFrom(owner, {from: receiver})
        const balance = await ins.balanceOf(receiver)
        assert.equal(200 * 10 ** 18, balance.toNumber())
      })

    })
  })
})
