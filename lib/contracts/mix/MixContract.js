"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Config_1 = __importDefault(require("../../Config"));
const Wallet_1 = __importDefault(require("../../klaytn/Wallet"));
const KIP7Contract_1 = __importDefault(require("../standard/KIP7Contract"));
class MixContract extends KIP7Contract_1.default {
    constructor() {
        super(Config_1.default.contracts.Mix, require("./MixContractABI.json"));
    }
    async totalSupply() {
        return ethers_1.BigNumber.from(await this.runMethod("totalSupply"));
    }
    async burn(amount) {
        const owner = await Wallet_1.default.loadAddress();
        if (owner !== undefined) {
            if ((await this.allowance(owner, this.address)).lt(amount)) {
                await this.approve(this.address, ethers_1.constants.MaxUint256);
                await new Promise((resolve) => {
                    setTimeout(async () => {
                        await this.runWalletMethod("burn", amount);
                        resolve();
                    }, 2000);
                });
            }
            else {
                await this.runWalletMethod("burn", amount);
            }
        }
    }
}
exports.default = new MixContract();
//# sourceMappingURL=MixContract.js.map