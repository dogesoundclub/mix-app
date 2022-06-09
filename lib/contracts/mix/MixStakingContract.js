"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const Config_1 = __importDefault(require("../../Config"));
const Contract_1 = __importDefault(require("../Contract"));
class MixStakingContract extends Contract_1.default {
    constructor() {
        super(Config_1.default.contracts.MixStaking, require("./MixStakingContractABI.json"));
    }
    async stakingBlocks(nft, id) {
        return ethers_1.BigNumber.from(await this.runMethod("stakingBlocks", nft, id));
    }
}
exports.default = new MixStakingContract();
//# sourceMappingURL=MixStakingContract.js.map