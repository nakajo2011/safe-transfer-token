const TestToken = artifacts.require('./TestToken.sol')
contract('TestSafeTransferToken', (accounts) => {
  it("should assert true", async () => {
    const ins = await TestToken.new()
    assert.isOk(ins)
  })
})
