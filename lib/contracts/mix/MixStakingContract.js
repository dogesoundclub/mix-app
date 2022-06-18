"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Config_1 = __importDefault(require("../../Config"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const Contract_1 = __importDefault(require("../Contract"));
const MixContract_1 = __importDefault(require("./MixContract"));
class MixStakingContract extends Contract_1.default {
    constructor() {
        super(Config_1.default.contracts.MixStaking, require("./MixStakingContractABI.json"));
    }
    async mixNeeds() {
        return ethers_1.BigNumber.from(await this.runMethod("mixNeeds"));
    }
    async returnMixTime() {
        return ethers_1.BigNumber.from(await this.runMethod("returnMixTime"));
    }
    async stakingBlocks(nft, id) {
        return ethers_1.BigNumber.from(await this.runMethod("stakingBlocks", nft, id));
    }
    async returnMixTimes(nft, id) {
        return ethers_1.BigNumber.from(await this.runMethod("returnMixTimes", nft, id));
    }
    async stakingMix(nfts, ids) {
        const owner = await Wallet_1.default.loadAddress();
        if (owner !== undefined) {
            const mixNeeds = (await this.mixNeeds()).mul(nfts.length);
            if ((await MixContract_1.default.allowance(owner, this.address)).lt(mixNeeds)) {
                await MixContract_1.default.approve(this.address, ethers_1.constants.MaxUint256);
                await new Promise((resolve) => {
                    setTimeout(async () => {
                        await this.runWalletMethod("stakingMix", nfts, ids);
                        resolve();
                    }, 2000);
                });
            }
            else {
                await this.runWalletMethod("stakingMix", nfts, ids);
            }
        }
    }
    async withdrawMix(nfts, ids) {
        await this.runWalletMethod("withdrawMix", nfts, ids);
    }
}
exports.default = new MixStakingContract();
//# sourceMappingURL=MixStakingContract.js.map