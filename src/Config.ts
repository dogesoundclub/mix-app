const TESTNET = false;

export default {

    isTestnet: TESTNET,
    chainId: TESTNET ? 1001 : 8217,

    apiHost: "api.mix.info",
    admin: "0x5d3C6E36538f485C3483B1C0d3e27a3416E16217",

    contracts: TESTNET ? {
        // Testnet
        Mate: "0xCa7894953066B8C0a05e123454f586CDe4B42Fa7",
        EMates: "",
        Bias: "",

        DogeSoundContest: "0x5BE7BFee608b2aa0c022D11EFDCCC0bD3477C6Cf",
        Name: "0xBC514ba706604DbADF34D640367DCEA7A46983Df",
        NameV2: "",
        Message: "0x4843027f225da25a017a78eF419191860E482B52",
        Image: "0x670CE33477dfaEd14e0c1b8C66e1687B10469b8E",
        Attributes: "0x2666D38bcBBB50EC5717ef6B96fb55aA6a2334Cf",
        DogeSoundContestV2: "0x676289E02e8c0264417e4bEc9413d6007a686Be3",
        FollowMe: "0xa8D43b45D84169076DccFd4B17C769080A8e86C6",
        Vote: "0x2EA83A978747d2F732b5E4D3BeeB12a7c4eDD743",

        Mix: "0xAe0a2e1DA2469FFdf8308160eE64Fe3656d9D9D0",
        KSP: "",
        NewKlayPunk: "",

        MixEmitter: "0x26339a890A5B2AD1B9ca31c073a37112BB9f21a3",
        DevFundToken: "0xf3635EF377D690D034530ca78EdC9c1028188896",
        DevFundPool: "0x43793E818aC2ba1De69C279d571D3e8d7d9Bfb15",
        MatesPool: "0x6f49D139359D0c7Bf44Df4520494A6ABB39434dD",
        EMatesPool: "",
        BiasPool: "",

        Booth: "0xb45fC0Ff500cFb4deF3b5148B597884B797fF4Fd",
        BurnPool: "0xC7995B29d95006f737861DC5288920FAF16e5Ff7",
        Turntables: "0xB1EFA1E4b2E666cAB233E2241B9DA11d9EA97504",
        TurntableExtras: "0xE33B45955Ff4C2af63cAF5a2f0f5e0ff3b86038B",
        MatesListeners: "0x03E0545C837BFa5Ab9A1F950c54784ee5F0EB53D",
        KlayMIXListeners: "0x781A91157612DF86959e400bCb27FdfeECCe081D",
        KSPMIXListeners: "0x333Ba1e532c95C6731aa305505B24CAD9c13F013",
        KlayMIXListenersV2: "",
        KSPMIXListenersV2: "",

        KlayMIXLPToken: "0xAe0a2e1DA2469FFdf8308160eE64Fe3656d9D9D0",
        KSPMIXLPToken: "0xAe0a2e1DA2469FFdf8308160eE64Fe3656d9D9D0",

        Klayswap: "",
        MixPriceEstimator: "",

        // partners
        CasesByKate: "",
        CasesByKatePool: "",
        AnimalsPunksV2: "",
        AnimalsPunksV2Pool: "",
        PixelCat: "",
        PixelCatPool: "",
        KLITS: "",
        KLITSPool: "",
        Cryptorus: "",
        CryptorusPool: "",

        MixStaking: "",
    } : {
        // Mainnet
        Mate: "0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae",
        EMates: "0x2b303fd0082e4b51e5a6c602f45545204bbbb4dc",
        Bias: "0xdedd727ab86bce5d416f9163b2448860bbde86d4",

        DogeSoundContest: "0x90B1a227A69b3A907167fFE7956dc965117CBF20",
        Name: "0x12C591fCd89B83704541B1Eac6b4aA18063A6954",
        NameV2: "0xd095c72B42547c7097089E36908d60d13347823a",
        Message: "0x1a693c175E510959F37d54AcFF0fAC0daC8d9a2D",
        Image: "0x059308948cf1F550E15869f9C3E02dCEb8814F0A",
        Attributes: "0xB16cA0035f398EA513c063a2F61C7631413bCD7d",
        DogeSoundContestV2: "0x43f3b52C1cb0801efA4EFa6a6b1908746E2a3210",
        FollowMe: "0x68d0EC90b70407089a419EE99C32a44c0f5Da775",
        Vote: "0x7f87e061068B04b62a2e119Cef3b44c2d1a177CD",

        Mix: "0xDd483a970a7A7FeF2B223C3510fAc852799a88BF",
        KSP: "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654",
        NewKlayPunk: "0x37C38B19a6bA325486Da87f946e72dC93E0AB39a",

        MixEmitter: "0x0281dDafc6718b2B60bda163550f2F5F59D92C09",
        DevFundToken: "0x6a7b98B2c69AE29a14857E033D16A714A3206B89",
        DevFundPool: "0x91471263590FB259bf6208ba414bf17B0126Bbb7",
        MatesPool: "0xbc9C42267037786f42831d4f36D629A3888c9b4a",
        EMatesPool: "0x4316feE26c85c7a19063dA597b4DdF1476d0C986",
        BiasPool: "0x83BD2Fa1806b36bC7B0747e37482544Bed56529e",

        Booth: "0x8a654D485AaEed652500B5F18A7e4bb58Ac8ef9F",
        BurnPool: "0x4b1e4c30B12B8564686FF30F608a18Abfbd7adBc",
        Turntables: "0xFe605356e99e8662Da61dF32e237D03BEd6A8D54",
        TurntableExtras: "0xA726F183d84C0f2645FF138CDC572b0d0D0D8b93",
        MatesListeners: "0x97245cDC80F1Ca50CD59f37030cdA00805A2dc54",
        KlayMIXListeners: "0xe5C799A39450F1FFCaDf768b229DB9e13F23bb5E",
        KSPMIXListeners: "0x1D3bC75B6D33C5b5DE7D734686bb5404C6454a4d",
        KlayMIXListenersV2: "0xBeE6480d1A82C29938923B4e4e59C89f4aFFE1Ac",
        KSPMIXListenersV2: "0xF28C1be4129f795593071EC9A39Dfc3De602CDd5",

        KlayMIXLPToken: "0xa50cec0216c1cee6f90c7d5359444d46315279bd",
        KSPMIXLPToken: "0xade6684a81a205e4bfc544b51cca448c458c0961",

        Klayswap: "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654",
        MixPriceEstimator: "0x637ce9D4B6cb790e81110f1a5D9869E32b8Fbde2",

        // partners
        CasesByKate: "0x0af3f3fe9e822b7a740ca45ce170340b2da6f4cc",
        CasesByKatePool: "0xAF7ca190179d54860484f0A3263e0B7E8B13b9C7",
        AnimalsPunksV2: "0x590744cb8cf1a698d7db509b52bf209e3cccb8e0",
        AnimalsPunksV2Pool: "0xF1A72599E9c57BfE4B62A09052e14b67B54e3037",
        PixelCat: "0xCE8905B85119928E6c828E5CB4E2a9fd2e128bf9",
        PixelCatPool: "0x4eb6baE0dcf63f52c951ABBCa292F5293C757F93",
        KLITS: "0x0a412f094c15010bbd413be0fc07b8da26b0b05f",
        KLITSPool: "0xAB8f0C87d97b2B2E2C99528Ebb265689F6663D31",
        Cryptorus: "0xf556116c62203424fa0c0c659cadcdd8d9d07675",
        CryptorusPool: "0x47910a706348bf2ae14086e78AC080d31762B171",

        MixStaking: "0x226cA982Bf947e327313472CC60592f93CBca01B",
    },
};
