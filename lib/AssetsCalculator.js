"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const skyutil_1 = __importDefault(require("skyutil"));
const BoothContract_1 = __importDefault(require("./contracts/mix/BoothContract"));
const MixContract_1 = __importDefault(require("./contracts/mix/MixContract"));
const MixEmitterContract_1 = __importDefault(require("./contracts/mix/MixEmitterContract"));
const pools_json_1 = __importDefault(require("./pools.json"));
const Utils_1 = __importDefault(require("./Utils"));
class AssetsCalculator {
    constructor() {
        this.mixsetToMix = 1;
        this.poolInfo = {};
    }
    async init() {
        const totalMix = await MixContract_1.default.balanceOf(BoothContract_1.default.address);
        const totalMixset = await BoothContract_1.default.getTotalSupply();
        const mixsetToMix = ethers_1.utils.formatEther(totalMix.mul(ethers_1.BigNumber.from("1000000000000000000")).div(totalMixset));
        this.mixsetToMix = parseFloat(mixsetToMix);
        const poolCount = (await MixEmitterContract_1.default.poolCount()).toNumber();
        await skyutil_1.default.repeatResultAsync(poolCount, async (pid) => {
            const poolInfo = await MixEmitterContract_1.default.poolInfo(pid);
            this.poolInfo[poolInfo.to] = poolInfo.allocPoint;
        });
    }
    calculatePercent(total, assets) {
        let percent = 0;
        if (total !== undefined && assets !== undefined) {
            const totalMixPercent = (parseFloat(ethers_1.utils.formatEther(total.mix)) +
                parseFloat(ethers_1.utils.formatEther(total.mixset)) * this.mixsetToMix);
            const mixPercent = totalMixPercent === 0 ? 0 : (parseFloat(ethers_1.utils.formatEther(assets.mix)) +
                parseFloat(ethers_1.utils.formatEther(assets.mixset)) * this.mixsetToMix) / totalMixPercent;
            percent += mixPercent / 2;
            let poolPercent = 0;
            let totalPoolPercent = 0;
            for (const [address, percent] of Object.entries(this.poolInfo)) {
                const pool = pools_json_1.default[address];
                if (pool !== undefined) {
                    if (pool.name === "Dev Fund") {
                        if (total.devfunds !== "0") {
                            poolPercent += parseFloat(ethers_1.utils.formatEther(assets.devfunds)) / parseFloat(ethers_1.utils.formatEther(total.devfunds)) * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Mates") {
                        if (total.mates !== 0) {
                            poolPercent += assets.mates / total.mates * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Klay-MIX LP") {
                        if (total.klaylp !== "0") {
                            poolPercent += parseFloat(ethers_1.utils.formatEther(assets.klaylp)) / parseFloat(ethers_1.utils.formatEther(total.klaylp)) * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "KSP-MIX LP") {
                        if (total.ksplp !== "0") {
                            poolPercent += parseFloat(ethers_1.utils.formatEther(assets.ksplp)) / parseFloat(ethers_1.utils.formatEther(total.ksplp)) * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Cases by Kate") {
                        if (total.cases !== 0) {
                            poolPercent += assets.cases / total.cases * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Animals Punks V2") {
                        if (total.apunks !== 0) {
                            poolPercent += assets.apunks / total.apunks * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Turntables") {
                        if (total.turntableVolume !== 0) {
                            poolPercent += assets.turntableVolume / total.turntableVolume * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Pixel Cat") {
                        if (total.pixelcats !== 0) {
                            poolPercent += assets.pixelcats / total.pixelcats * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "KLITS") {
                        if (Utils_1.default.undefinedToZero(total.klits) !== 0) {
                            poolPercent += Utils_1.default.undefinedToZero(assets.klits) / Utils_1.default.undefinedToZero(total.klits) * percent;
                            totalPoolPercent += percent;
                        }
                    }
                    else if (pool.name === "Cryptorus") {
                        if (Utils_1.default.undefinedToZero(total.cryptorus) !== 0) {
                            poolPercent += Utils_1.default.undefinedToZero(assets.cryptorus) / Utils_1.default.undefinedToZero(total.cryptorus) * percent;
                            totalPoolPercent += percent;
                        }
                    }
                }
            }
            percent += poolPercent / totalPoolPercent / 2;
        }
        return percent * 100;
    }
}
exports.default = new AssetsCalculator();
//# sourceMappingURL=AssetsCalculator.js.map