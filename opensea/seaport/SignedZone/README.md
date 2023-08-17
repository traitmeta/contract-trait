# SignedZone合约

目前部署的SignedZone合约使用的协议是SIP7，具体协议细节可以查看[sip7](https://github.com/ProjectOpenSea/SIPs/blob/main/SIPS/sip-7.md)

## 如何部署测试合约

1. 首先部署SignedZoneController合约
2. 调用SignedZoneController合约的 `createZone` 方法
    ```solidity
      function createZone(
            string memory zoneName, // SignedZone
            string memory apiEndpoint, // 空
            string memory documentationURI, //空
            address initialOwner, // 指定的owner地址
            bytes32 salt  // first 20 bytes 必须是指定的owner地址
        ) external override returns (address signedZone) 
    ```
3. 调用 `updateSigner` 添加签名者
    ```solidity
    function updateSigner(
        address zone, // 2中创建的ZONE合约地址
        address signer, // 签名地址
        bool active  // 1 表示激活
    ) external override
    ```
4. 调用合约方法`getSeaportMetadata`，获取`domainSeparator`\

## 如何构建extraData

在REMIX中部署好测试的合约之后，就可以测试我们构建的extraData了，需要使用的几个方法在 `test.ts`中；

### 构建时的注意点

1. 合约中会判断version必须是0，也就是extraData返回的应该是以`00`开头
2. 合约中判断子协议的version必须是0，也就是context的开头也应该是`00`
3. context这个表示子协议，如果是00开头，类型就是1，表示 `required identifier for first returned received item`，也就是一个uint256;
    - context = version + value
    - 本次支持的context = 00 + uint256(identifier)，如果是native和ERC20支付，那么identifier是0


## 问答
1. 可以发现offer提供报价，ZONE signer会对Offer订单进行签名生成extraData， ~~那么offer报价者已经进行了签名操作，为什么还需要ZONE的签名和extraData?~~
    - 目前不使用Zone进行测试，发现一样可以成交，就是不能0gas取消报价
2. 接受报价或者接受拍卖出价，如果构造好数据，但是发送交易的用户不是本人是否可行？
    - 不行，会执行失败
    - 在_verfuSignature中会进行判断
        ```solidity
            // Determine whether the offerer is the caller.
            bool offererIsCaller;
            assembly {
                offererIsCaller := eq(offerer, caller())
            }

            // Skip signature verification if the offerer is the caller.
            if (offererIsCaller) {
                return;
            }
        ```